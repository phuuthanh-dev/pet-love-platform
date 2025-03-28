/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message, Input, Spin } from "antd";
import { editProfileAPI, getAllUsersAPI } from "@/apis/user";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const { Search } = Input;

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getAllUsersAPI(
        page,
        search ? 1000 : limit,
        search
      );

      console.log(response);
      if (response.data?.data?.results) {
        setUsers(response.data.data.results);
        setTotalResults(
          search
            ? response.data.data.results.length
            : response.data.data.totalResults
        );
      } else {
        setUsers([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBan = async (id) => {
    try {
      const response = await editProfileAPI({ id, isDeleted: true });
      if (response.data?.status === 200) {
        message.success(`User with ID ${id} has been banned!`);
        fetchUsers(currentPage);
      } else {
        message.error("Failed to ban the user. Please try again.");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("An error occurred. Please try again later.");
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-4">
          <span className="font-medium text-pink-700">Tên nhân viên</span>
          <Search
            placeholder="Tìm kiếm nhân viên..."
            onSearch={(value) => fetchUsers(1, value)}
            style={{ width: 220 }}
            allowClear
            prefix={<SearchOutlined style={{ color: "#f472b6" }} />}
            className="ml-auto"
          />
        </div>
      ),
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <div className="flex items-center">
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: <span className="font-medium text-pink-700">Email</span>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "isBlocked",
      key: "status",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Banned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        !record.isBlocked ? (
          <Popconfirm
            title="Bạn có chắc muốn cấm nhân viên này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleBan(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
            >
              <span className="flex items-center gap-1">
                <span>🚫</span> Cấm
              </span>
            </Button>
          </Popconfirm>
        ) : (
          <Tag color="#fecdd3" className="border-0 text-pink-800 px-3 py-1">
            Đã cấm
          </Tag>
        ),
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">🐾</span>{" "}
          <h1 className="text-2xl font-bold text-amber-800">
            Quản lý người dùng
          </h1>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số thành viên: <strong>{totalResults}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: limit,
              total: totalResults,
              onChange: handlePageChange,
              showSizeChanger: false,
              className: "custom-pagination",
              itemRender: (page, type) => {
                if (type === "page") {
                  return (
                    <span
                      className={`${
                        page === currentPage
                          ? "text-pink-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {page}
                    </span>
                  );
                }
                return null;
              },
            }}
            className="pet-friendly-table"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-pink-50/30" : "bg-white"
            }
          />
        </Spin>
      </div>
      <style jsx global>{`
        .pet-friendly-table .ant-table-thead > tr > th {
          background-color: #fdf3f8;
          border-bottom: 2px solid #fecdd3;
        }

        .ant-table-wrapper .ant-table-pagination.ant-pagination {
          margin: 16px 0;
        }

        .custom-pagination .ant-pagination-item-active {
          background-color: #fdf3f8;
          border-color: #f472b6;
        }

        .ant-pagination-item:hover {
          border-color: #f472b6;
        }
      `}</style>
    </div>
  );
};

export default User;
