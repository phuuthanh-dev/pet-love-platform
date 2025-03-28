/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { Table, Tag, Button, Popconfirm, message, Input } from "antd";
import { getAllStaffAPI } from "@/apis/admin";
import { editProfileAPI } from "@/apis/user";
import AddStaffModal from "@/components/features/staff/AddStaffModal";
import {
  SearchOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const ManageStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    getAllStaff(currentPage);
  }, [currentPage, isRefresh]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getAllStaff = async (page = 1, search = "") => {
    try {
      const { data } = await getAllStaffAPI(
        page,
        search ? 1000 : limit,
        search
      );
      setTotalResults(data.data.totalResults);
      setStaffMembers(data.data.results);
    } catch (error) {
      setStaffMembers([]); // Ensure it stays an array even if API fails
      setTotalResults(0);
      message.error("Không thể tải danh sách nhân viên");
    }
  };

  const handleBan = async (id) => {
    try {
      const response = await editProfileAPI({ id, isDeleted: true });
      if (response.data?.status === 200) {
        message.success({
          content: `Nhân viên với ID ${id} đã bị cấm thành công!`,
          icon: <ExclamationCircleOutlined style={{ color: "#ff7875" }} />,
        });
        getAllStaff(currentPage);
      } else {
        message.error("Không thể cấm nhân viên này. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-4">
          <span className="font-medium text-pink-700">Tên nhân viên</span>
          <Search
            placeholder="Tìm kiếm nhân viên..."
            onSearch={(value) => getAllStaff(1, value)}
            style={{ width: 220 }}
            allowClear
            prefix={<SearchOutlined style={{ color: "#f472b6" }} />}
            className="ml-auto"
          />
        </div>
      ),
      dataIndex: "username",
      key: "name",
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
      title: <span className="font-medium text-pink-700">Role</span>,
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag className="border-pink-300 text-amber-800 px-3 py-1">{role}</Tag>
      ),
    },
    {
      title: <span className="font-medium text-pink-700">Gender</span>,
      key: "gender",
      dataIndex: "gender",
      render: (gender) => (
        <div className="flex items-center">
          {gender === "male" ? (
            <span className="text-blue-500 mr-1">♂</span>
          ) : gender === "female" ? (
            <span className="text-pink-500 mr-1">♀</span>
          ) : (
            <span className="text-gray-500 mr-1">⚪</span>
          )}
          <span>{gender || "N/A"}</span>
        </div>
      ),
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
      title: <span className="font-medium text-pink-700">Hành động</span>,
      key: "action",
      render: (_, record) =>
        !record.isActived ? (
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Quản lý nhân viên
            </h1>
          </div>
          <Button
            onClick={() => setIsAddStaffModalOpen(true)}
            className="flex items-center gap-2 bg-pink-500 text-white border-0 hover:bg-pink-600 hover:border-0"
            icon={<UserAddOutlined />}
          >
            Thêm nhân viên mới
          </Button>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số nhân viên: <strong>{totalResults}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={staffMembers}
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
        <AddStaffModal
          open={isAddStaffModalOpen}
          onOpenChange={setIsAddStaffModalOpen}
          setIsRefresh={setIsRefresh}
          isRefresh={isRefresh}
        />
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

export default ManageStaff;
