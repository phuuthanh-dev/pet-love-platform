import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
} from "antd";
import Search from "antd/es/input/Search";
import {
  createCampaignAPI,
  deleteCampaignAPI,
  fetchCampaignsAPI,
} from "@/apis/campaign";
import { formatVND } from "@/utils/formatVND";
import { formatDate } from "@/utils/formatDateTime";
import {
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const ManageCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getAllCampaign = async (page = 1, search = "") => {
    try {
      const { data } = await fetchCampaignsAPI(page, limit, search);
      if (data?.data) {
        setCampaigns(data.data.results);
        setTotalResults(data.data.totalResults);
      }
    } catch (error) {
      setCampaigns([]);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    getAllCampaign(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCampaignAPI(id);
      if (response?.status === 200) {
        message.success(`Campaign with ID ${id} has been banned!`);
        getAllCampaign(currentPage);
      } else {
        message.error("Failed to ban the user. Please try again.");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("An error occurred. Please try again later.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate.toISOString());
      formData.append("endDate", values.endDate.toISOString());
      formData.append("targetAmount", values.targetAmount);
      formData.append("image", values.image.file.originFileObj);

      const response = await createCampaignAPI(formData);

      if (response.status === 201) {
        message.success("Campaign created successfully!");
        handleModalCancel();
        getAllCampaign(currentPage);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("Failed to create campaign. Please try again.");
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-10">
          Title
          <Search
            placeholder="Tìm kiếm chiến dịch..."
            onSearch={(value) => getAllCampaign(1, value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <img width={200} src={image} />,
    },
    {
      title: "Số tiền hiện tại",
      dataIndex: "currentAmount",
      key: "currentAmount",
      render: (currentAmount) => formatVND(currentAmount),
    },
    {
      title: "Mục tiêu",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (targetAmount) => formatVND(targetAmount),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => formatDate(startDate),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => formatDate(endDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "startDate",
      key: "status",
      render: (_, record) => {
        const today = dayjs();
        const startDate = dayjs(record.startDate);
        const endDate = dayjs(record.endDate);

        let statusText = "";
        let color = "default";

        if (today.isBefore(startDate) && record.isActive) {
          statusText = "Chưa diễn ra";
          color = "blue";
        } else if (today.isAfter(endDate)) {
          statusText = "Đã kết thúc";
          color = "gray";
        } else if (!record.isActive) {
          statusText = "Đã xoá";
          color = "red";
        } else {
          statusText = "Đang diễn ra";
          color = "green";
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.isActive ? (
          <div className="flex gap-2">
            <Link to={`/donate/${record?._id}`} target="_blank">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                style={{
                  background: "#fdf2f8",
                  borderColor: "#fbcfe8",
                  color: "#db2777",
                }}
                className="hover:bg-pink-200 hover:border-pink-300 hover:text-pink-800"
              >
                Xem
              </Button>
            </Link>
            <Popconfirm
              title="Bạn có chắc muốn xóa chiến dịch này?"
              description="Hành động này không thể hoàn tác!"
              onConfirm={() => handleDelete(record?._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ style: { background: "#db2777" } }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <Button type="primary" danger disabled>
            Delete
          </Button>
        ),
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
              Quản lý chiến dịch gây quỹ
            </h1>
            <p className="text-pink-500">
              Tạo và quản lý các chiến dịch gây quỹ giúp đỡ thú cưng
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{
              background: "#fdf2f8",
              borderColor: "#fbcfe8",
              color: "#db2777",
            }}
            className="hover:bg-pink-200 hover:border-pink-300 hover:text-pink-800"
          >
            Tạo chiến dịch mới
          </Button>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg mb-6 flex items-center border border-pink-200">
          <HeartOutlined className="text-2xl text-pink-500 mr-4" />
          <div>
            <h3 className="font-medium text-pink-700">Thống kê nhanh</h3>
            <p className="text-pink-600">
              Tổng số chiến dịch: {totalResults} | Đang hoạt động:{" "}
              {
                campaigns.filter(
                  (c) =>
                    c.isActive &&
                    dayjs().isAfter(dayjs(c.startDate)) &&
                    dayjs().isBefore(dayjs(c.endDate))
                ).length
              }
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={campaigns}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: totalResults,
            onChange: handlePageChange,
            showSizeChanger: false,
            className: "pagination-pink",
          }}
          className="custom-pet-table"
          bordered={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-pink-50" : ""
          }
        />
        <Modal
          title={
            <div className="flex items-center gap-2 text-pink-700">
              <HeartOutlined className="text-xl" />
              <span className="text-xl">Tạo chiến dịch gây quỹ mới</span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please input campaign title!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please input campaign description!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="targetAmount"
              label="Target Amount"
              rules={[
                { required: true, message: "Please input target amount!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="image"
              label="Campaign Image"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload maxCount={1} listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create Campaign
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCampaign;
