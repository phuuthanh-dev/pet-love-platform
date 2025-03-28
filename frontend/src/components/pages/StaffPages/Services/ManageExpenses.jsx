/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Typography,
  Tag,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { PawPrint } from "lucide-react";
import { getPetsHomePage } from "@/apis/pet";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/locale/vi_VN";
import { getExpenseTypes } from "@/apis/expenseType";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  uploadExpenseReceipt,
} from "@/apis/expense";

const { Title } = Typography;
const { Option } = Select;

// Add custom styles
const customStyles = {
  pageContainer: "p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen",
  headerContainer: "mb-8 bg-white rounded-xl p-6 shadow-md",
  headerTitle: "text-3xl font-bold text-pink-600 flex items-center gap-4",
  pawIcon: "w-10 h-10 text-pink-500 animate-bounce",
  addButton:
    "bg-pink-500 hover:bg-pink-600 shadow-lg transform hover:scale-105 transition-all duration-200",
  table: "bg-white rounded-xl overflow-hidden shadow-lg border-pink-100",
  tableRow: "hover:bg-pink-50/50 transition-colors duration-200",
  modal: {
    title: "text-xl font-semibold text-pink-600",
    content: "p-4",
    footer: "border-t border-pink-100 p-4",
  },
  formLabel: "font-medium text-gray-700",
  input: "hover:border-pink-400 focus:border-pink-500 focus:ring-pink-500",
  select: "hover:border-pink-400",
  tag: {
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  },
  uploadSection: "mt-4 flex flex-col items-center",
  uploadContainer:
    "w-full border-2 border-dashed border-pink-300 rounded-lg p-4 text-center",
  receiptPreview:
    "mt-4 max-w-full max-h-64 object-contain rounded-lg shadow-md",
};

function ManageExpenses() {
  const [pets, setPets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadingExpenseId, setUploadingExpenseId] = useState(null);
  const [isReceiptUploadModalVisible, setIsReceiptUploadModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch pets data
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await getPetsHomePage(1, 1000);
        setPets(response.data.data.results);
      } catch (error) {
        console.error("Error fetching pets:", error);
        message.error("Không thể tải danh sách thú cưng");
      }
    };
    const fetchExpenseTypes = async () => {
      try {
        const response = await getExpenseTypes();
        setExpenseTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching expense types:", error);
        message.error("Không thể tải danh sách loại chi phí");
      }
    };
    const fetchExpense = async () => {
      try {
        const response = await getExpenses(page, pageSize);
        setTotal(response.data.data.totalResults);
        setExpenses(response.data.data.results);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        message.error("Không thể tải danh sách chi phí");
      }
    };
    fetchPets();
    fetchExpense();
    fetchExpenseTypes();
  }, [page, pageSize]);

  // Handle pagination change
  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    // You can also handle sorting here if needed
    if (sorter.field) {
      // Handle sorting logic if required
      console.log("Sort by:", sorter.field, sorter.order);
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleReceiptUpload = async (expenseId) => {
    try {
      // Open a modal specifically for receipt upload
      setUploadingExpenseId(expenseId);
      setIsReceiptUploadModalVisible(true); // Mở modal upload hóa đơn
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải hóa đơn");
    }
  };

  // Enhanced table columns with better styling
  const columns = [
    {
      title: "Thú cưng",
      dataIndex: "pet",
      key: "pet",
      filters: [
        { text: "Tất cả", value: "all" },
        ...pets.map((pet) => ({ text: pet.name, value: pet._id })),
      ],
      onFilter: (value, record) =>
        value === "all" ? true : record.pet?._id === value,
      render: (pet) => {
        if (!pet || typeof pet !== "object") return "Không xác định";
        return (
          <div className="flex items-center space-x-3 py-2">
            <div className="relative">
              <img
                src={
                  pet.image_url?.[0]?.[0] || "https://via.placeholder.com/40"
                }
                alt={pet.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-sm"
              />
              <PawPrint className="w-4 h-4 text-pink-500 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
            <span className="font-medium text-gray-700">{pet.name}</span>
          </div>
        );
      },
    },
    {
      title: "Người tạo chi tiêu",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => (
        <div className="flex items-center space-x-2">
          <img
            src={createdBy?.profilePicture || "https://via.placeholder.com/40"}
            alt={createdBy?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{createdBy?.username}</span>
        </div>
      ),
    },
    {
      title: "Loại chi phí",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Tất cả", value: "all" },
        ...expenseTypes.map((type) => ({
          text: type.name,
          value: type._id,
        })),
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.type?._id === value;
      },
      render: (type) => {
        if (!type || typeof type !== "object") return "Không xác định";
        return (
          <Tag
            color={type.color}
            className="px-3 py-1 rounded-full text-sm font-medium"
          >
            {type.name}
          </Tag>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Ngày chi tiêu",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const tagStyles = {
          "Waiting for Review":
            "bg-yellow-100 text-yellow-800 border-yellow-200",
          "Receipt Pending": "bg-orange-100 text-orange-800 border-orange-200",
          Pending: "bg-blue-100 text-blue-800 border-blue-200",
          Completed: "bg-green-100 text-green-800 border-green-200",
          Rejected: "bg-red-100 text-red-800 border-red-200",
        };
        const labels = {
          "Waiting for Review": "Chờ duyệt hóa đơn",
          "Receipt Pending": "Chờ hóa đơn",
          Pending: "Chờ được duyệt",
          Completed: "Đã hoàn thành",
          Rejected: "Từ chối",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tagStyles[status] || tagStyles.Pending
            }`}
          >
            {labels[status] || "Chờ duyệt"}
          </span>
        );
      },
    },
    {
      title: "Hóa đơn",
      dataIndex: "receipt",
      key: "receipt",
      render: (receipt) =>
        receipt ? (
          <img
            src={receipt}
            alt="Hóa đơn"
            className="w-16 h-16 object-cover rounded-lg cursor-pointer"
            onClick={() => window.open(receipt, "_blank")}
          />
        ) : (
          <span>Không có hóa đơn</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "Receipt Pending" && (
            <Button
              icon={<UploadOutlined />}
              onClick={() => handleReceiptUpload(record._id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-none shadow-none"
            >
              Tải hóa đơn
            </Button>
          )}
          {record.status === "Pending" && (
            <Popconfirm
              title="Bạn có chắc muốn xóa chi tiêu này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
            >
              <Button
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-none shadow-none"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Modal handlers
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement delete API call
      const res = await deleteExpense(id);
      if (res.status === 200) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
        message.success("Xóa chi tiêu thành công");
      }
    } catch (error) {
      message.error("Không thể xóa chi tiêu");
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        setLoading(true);
        const createData = {
          petId: values.petId,
          type: values.type,
          amount: values.amount,
          date: values.date.toISOString(),
          note: values.note,
        };

        // TODO: Implement create API call
        const response = await createExpense(createData);
        if (response.status === 201) {
          setExpenses([response.data.data, ...expenses]);
          message.success("Thêm chi tiêu thành công");
        }

        setIsModalVisible(false);
        form.resetFields();
        setReceiptFile(null);
      } catch (error) {
        message.error("Có lỗi xảy ra khi lưu chi tiêu");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleUploadChange = (info) => {
    const fileList = [...info.fileList];
    form.setFieldsValue({ receipt: fileList });

    const latestFile = fileList[fileList.length - 1];
    if (latestFile.status === "done") {
      setReceiptFile(latestFile);
    } else if (latestFile.status === "removed") {
      setReceiptFile(null);
    }
  };

  const renderReceiptUpload = () => (
    <Form.Item name="receipt" label="Hóa đơn" className="mt-4">
      <Upload
        name="receipt"
        listType="picture"
        className="receipt-uploader"
        accept="image/*"
        maxCount={1}
        showUploadList={{
          showPreviewIcon: false,
          showRemoveIcon: true,
          removeIcon: <CloseOutlined style={{ color: "red" }} />,
        }}
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          const isLt5M = file.size / 1024 / 1024 < 5;

          if (!isImage) {
            message.error("Bạn chỉ có thể tải lên tệp hình ảnh!");
          }
          if (!isLt5M) {
            message.error("Hình ảnh phải nhỏ hơn 5MB!");
          }

          return isImage && isLt5M;
        }}
        onChange={handleUploadChange}
        customRequest={({ file, onSuccess, onError }) => {
          onSuccess("ok");
        }}
      >
        {!receiptFile && (
          <div className="upload-placeholder">
            <UploadOutlined className="text-pink-500" />
            <div className="text-gray-500 mt-2">Tải lên hóa đơn</div>
          </div>
        )}
      </Upload>

      {/* Add custom CSS for styling */}
      <style>{`
        .receipt-uploader {
          width: 100%; /* Đảm bảo nút chiếm đủ chiều rộng */
          height: 100px; /* Đảm bảo chiều cao đủ để hiển thị */
          border: 2px dashed #FF1493; /* Đường viền hồng */
          border-radius: 8px; /* Bo góc */
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }
        .receipt-uploader:hover {
          border-color: #FF1493;
        }
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .upload-placeholder .anticon {
          font-size: 36px;
        }
      `}</style>
    </Form.Item>
  );

  const handleReceiptModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();

        // Get the receipt file
        const receiptUpload = form.getFieldValue("receipt");
        if (receiptUpload && receiptUpload[0]?.originFileObj) {
          formData.append("receipt", receiptUpload[0].originFileObj);
        } else {
          message.error("Vui lòng tải lên hóa đơn");
          return;
        }

        // Call API to upload receipt for specific expense
        const response = await uploadExpenseReceipt(
          uploadingExpenseId,
          formData
        );
        
        if (response.status === 200) {
          const updatedExpenses = expenses.map((expense) =>
            expense._id === uploadingExpenseId
              ? {
                  ...expense,
                  status: response.data.data.status,
                  receipt: response.data.data.receipt,
                  updatedAt: response.data.data.updatedAt,
                }
              : expense
          );

          setExpenses(updatedExpenses);
          message.success("Tải lên hóa đơn thành công");

          // Close modal and reset states
          setIsReceiptUploadModalVisible(false);
          setUploadingExpenseId(null);
          setReceiptFile(null);
          form.resetFields();
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải lên hóa đơn");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className={customStyles.pageContainer}>
      <div className={customStyles.headerContainer}>
        <div className="flex justify-between items-center">
          <Title level={2} className={customStyles.headerTitle}>
            <PawPrint className={customStyles.pawIcon} />
            <span>Quản lý chi tiêu thú cưng</span>
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={customStyles.addButton}
          >
            Thêm chi tiêu mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} chi tiêu`,
          pageSizeOptions: ["5", "10", "20", "50"],
          position: ["bottomCenter"],
          className: "pagination-pink",
        }}
        onChange={handleTableChange}
        className={customStyles.table}
        rowClassName={customStyles.tableRow}
      />

      <Modal
        title="Thêm chi tiêu mới"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setReceiptFile(null);
        }}
        confirmLoading={loading}
        width={600}
        className="pet-expense-modal"
        okButtonProps={{ className: "bg-pink-500 hover:bg-pink-600" }}
      >
        <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
          <Form.Item
            name="petId"
            label="Thú cưng"
            rules={[{ required: true, message: "Vui lòng chọn thú cưng" }]}
          >
            <Select
              placeholder="Chọn thú cưng"
              onChange={(value) => {
                const selectedPet = pets.find((pet) => pet._id === value);
                if (selectedPet) {
                  const balance =
                    selectedPet.totalDonation - selectedPet.totalExpenses;
                  form.setFieldsValue({ maxBalance: balance });
                }
              }}
            >
              {pets.map((pet) => {
                const balance = pet.totalDonation - pet.totalExpenses;
                return (
                  <Option key={pet._id} value={pet._id}>
                    {pet.name} - Số dư: {formatCurrency(balance)}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại chi phí"
            rules={[{ required: true, message: "Vui lòng chọn loại chi phí" }]}
          >
            <Select placeholder="Chọn loại chi phí">
              {expenseTypes.map((type) => (
                <Option key={type?._id} value={type._id}>
                  {type?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Số tiền">
            <Form.Item
              name="amount"
              noStyle
              rules={[
                { required: true, message: "Vui lòng nhập số tiền" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const maxBalance = getFieldValue("maxBalance");
                    if (!value || !maxBalance) {
                      return Promise.reject(
                        new Error("Vui long chọn thú cưng trước")
                      );
                    }
                    if (value < 10000) {
                      return Promise.reject(
                        new Error("Số tiền phải lớn hơn 10,000 VND")
                      );
                    }
                    if (value <= maxBalance) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        `Số tiền không được vượt quá số dư hiện có (${formatCurrency(
                          maxBalance
                        )})`
                      )
                    );
                  },
                }),
              ]}
            >
              <Input
                type="number"
                prefix={<DollarOutlined />}
                placeholder="Nhập số tiền"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              shouldUpdate={(prev, cur) => prev.maxBalance !== cur.maxBalance}
              noStyle
            >
              {({ getFieldValue }) => {
                return (
                  <span className="text-sm text-gray-500 mt-1">
                    Số dư hiện có:{" "}
                    {formatCurrency(getFieldValue("maxBalance")) || 0}
                  </span>
                );
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày chi tiêu"
            rules={[{ required: true, message: "Vui lòng chọn ngày chi tiêu" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú!" }]}
          >
            <Input.TextArea placeholder="Nhập ghi chú (bắt buộc)" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal upload hóa đơn */}
      <Modal
        title="Tải lên hóa đơn"
        open={isReceiptUploadModalVisible}
        onOk={handleReceiptModalOk}
        onCancel={() => {
          setIsReceiptUploadModalVisible(false);
          setUploadingExpenseId(null);
          setReceiptFile(null);
        }}
        confirmLoading={loading}
        width={600}
        className="pet-expense-modal"
        okButtonProps={{ className: "bg-pink-500 hover:bg-pink-600" }}
      >
        <Form form={form} layout="vertical">
          {renderReceiptUpload()}
        </Form>
      </Modal>
    </div>
  );
}

export default ManageExpenses;
