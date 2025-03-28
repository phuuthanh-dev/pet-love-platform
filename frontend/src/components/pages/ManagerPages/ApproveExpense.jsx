import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Typography,
  Tag,
  Progress,
  Card,
  Modal,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PawPrint } from "lucide-react";
import { getPetsHomePage } from "@/apis/pet";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getExpenseTypes } from "@/apis/expenseType";
import { approveExpense, getExpenses, verifyExpense } from "@/apis/expense";

const { Title } = Typography;

function ApproveExpense() {
  const [pets, setPets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [petPage, setPetPage] = useState(1);
  const [petPageSize, setPetPageSize] = useState(10);
  const [petTotal, setPetTotal] = useState(0);
  const [petLoading, setPetLoading] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensePage, setExpensePage] = useState(1);
  const [expensePageSize, setExpensePageSize] = useState(10);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Fetch pets data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);

  //     try {
  //       const [petsRes, expensesRes, expenseTypesRes] = await Promise.all([
  //         getPetsHomePage(page, pageSize),
  //         getExpenses(expensePage, expensePageSize),
  //         getExpenseTypes(),
  //       ]);

  //       setPets(petsRes.data.data.results);
  //       setTotal(petsRes.data.data.totalResults);
  //       setExpenses(expensesRes.data.data.results);
  //       setTotalExpenses(expensesRes.data.data.totalResults);
  //       setExpenseTypes(expenseTypesRes.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       message.error("Không thể tải dữ liệu");
  //     } finally {
  //       setLoading(false); // ✅ Dữ liệu đã tải xong
  //     }
  //   };

  //   fetchData();
  // }, [page, pageSize, expensePage, expensePageSize]);
  const [approvalConfirmation, setApprovalConfirmation] = useState({
    visible: false,
    expenseId: null,
    action: null,
  });

  useEffect(() => {
    const fetchPets = async () => {
      setPetLoading(true);
      try {
        const petsRes = await getPetsHomePage(petPage, petPageSize);
        setPets(petsRes.data.data.results);
        setPetTotal(petsRes.data.data.totalResults);
      } catch (error) {
        console.error("Error fetching pets:", error);
        message.error("Không thể tải danh sách thú cưng");
      } finally {
        setPetLoading(false);
      }
    };

    fetchPets();
  }, [petPage, petPageSize]);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpenseLoading(true);
      try {
        const [expensesRes, expenseTypesRes] = await Promise.all([
          getExpenses(expensePage, expensePageSize),
          getExpenseTypes(),
        ]);

        setExpenses(expensesRes.data.data.results);
        setTotalExpenses(expensesRes.data.data.totalResults);
        setExpenseTypes(expenseTypesRes.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        message.error("Không thể tải danh sách chi tiêu");
      } finally {
        setExpenseLoading(false);
      }
    };

    fetchExpenses();
  }, [expensePage, expensePageSize]);

  // // Function to handle expense verification
  // const handleVerify = async (expenseId, verificationStatus) => {
  //   try {
  //     const response = await verifyExpense(expenseId, verificationStatus);
  //     if (response.status === 200) {
  //       setExpenses((prev) =>
  //         prev.map((exp) =>
  //           exp._id === expenseId ? { ...exp, status: verificationStatus } : exp
  //         )
  //       );
  //       message.success(
  //         verificationStatus === "Completed"
  //           ? "Chi tiêu đã được xác minh thành công"
  //           : "Chi tiêu đã bị từ chối"
  //       );
  //     } else {
  //       message.error("Có lỗi xảy ra khi xác minh chi tiêu");
  //     }
  //   } catch (error) {
  //     message.error("Có lỗi xảy ra khi xác minh chi tiêu");
  //   }
  // };

  // // Function to handle approval
  // const handleApprove = async (expenseId) => {
  //   try {
  //     const response = await approveExpense(expenseId, "Receipt Pending");
  //     if (response.status === 200) {
  //       setExpenses((prev) =>
  //         prev.map((exp) =>
  //           exp._id === expenseId ? { ...exp, status: "Receipt Pending" } : exp
  //         )
  //       );
  //       message.success(
  //         "Chi tiêu đã được duyệt và đang chờ hóa đơn từ nhân viên"
  //       );
  //     } else {
  //       message.error("Có lỗi xảy ra khi duyệt chi tiêu");
  //     }
  //   } catch (error) {
  //     message.error("Có lỗi xảy ra khi duyệt chi tiêu");
  //   }
  // };

  // // Function to handle rejection
  // const handleReject = async (expenseId) => {
  //   try {
  //     const response = await approveExpense(expenseId, "Rejected");
  //     if (response.status === 200) {
  //       setExpenses((prev) =>
  //         prev.map((exp) =>
  //           exp._id === expenseId ? { ...exp, status: "Rejected" } : exp
  //         )
  //       );
  //       message.success("Chi tiêu đã bị từ chối");
  //     } else {
  //       message.error("Có lỗi xảy ra khi từ chối chi tiêu");
  //     }
  //   } catch (error) {
  //     message.error("Có lỗi xảy ra khi từ chối chi tiêu");
  //   }
  // };

  // Function to show confirmation modal
  const showConfirmationModal = (expenseId, action) => {
    setApprovalConfirmation({
      visible: true,
      expenseId,
      action,
    });
  };
  const handleConfirmation = async () => {
    const { expenseId, action } = approvalConfirmation;

    // Close the confirmation modal
    setApprovalConfirmation({ visible: false, expenseId: null, action: null });

    try {
      let response;
      let successMessage;
      let errorMessage;

      // Determine the action based on the confirmation
      switch (action) {
        case "approve":
          response = await approveExpense(expenseId, "Receipt Pending");
          successMessage =
            "Chi tiêu đã được duyệt và đang chờ hóa đơn từ nhân viên";
          errorMessage = "Có lỗi xảy ra khi duyệt chi tiêu";
          break;
        case "reject":
          response = await approveExpense(expenseId, "Rejected");
          successMessage = "Chi tiêu đã bị từ chối";
          errorMessage = "Có lỗi xảy ra khi từ chối chi tiêu";
          break;
        case "verify":
          response = await verifyExpense(expenseId, "Completed");
          successMessage = "Chi tiêu đã được xác minh thành công";
          errorMessage = "Có lỗi xảy ra khi xác minh chi tiêu";
          break;
        case "reject-verification":
          response = await verifyExpense(expenseId, "Rejected");
          successMessage = "Chi tiêu đã bị từ chối";
          errorMessage = "Có lỗi xảy ra khi từ chối chi tiêu";
          break;
        default:
          throw new Error("Invalid action");
      }

      if (response.status === 200) {
        // Update the expenses state
        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId
              ? {
                  ...exp,
                  status:
                    action === "verify"
                      ? "Completed"
                      : action === "reject-verification"
                      ? "Receipt Pending"
                      : action === "approve"
                      ? "Receipt Pending"
                      : "Rejected",
                  receipt: action === "verify" ? exp.receipt : null,
                }
              : exp
          )
        );
        message.success(successMessage);
      } else {
        message.error(errorMessage);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra trong quá trình xử lý");
    }
  };

  const handleCancelConfirmation = () => {
    setApprovalConfirmation({ visible: false, expenseId: null, action: null });
  };

  // Handle pagination change
  const handlePetTableChange = (pagination) => {
    setPetPage(pagination.current);
    setPetPageSize(pagination.pageSize);
  };

  const handleExpenseTableChange = (pagination) => {
    setExpensePage(pagination.current);
    setExpensePageSize(pagination.pageSize);
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate financial status for each pet
  const calculatePetFinances = () => {
    return pets.map((pet) => {
      const usagePercentage = (pet.totalExpenses / pet.totalDonation) * 100;

      return {
        key: pet._id,
        name: pet.name,
        totalDonation: pet.totalDonation,
        donationGoal: pet.donationGoal,
        totalExpenses: pet.totalExpenses,
        remainingFunds: pet.remainingFunds,
        usagePercentage: usagePercentage,
      };
    });
  };

  // Financial overview columns
  const financeColumns = [
    {
      title: "Thú cưng",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <PawPrint
            className={`w-5 h-5 ${
              record.balance >= 0 ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "Mục tiêu",
      dataIndex: "donationGoal",
      key: "donationGoal",
      render: (amount) => (
        <div className="font-medium text-pink-600">
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a, b) => a.donationGoal - b.donationGoal,
    },
    {
      title: "Tổng donate",
      dataIndex: "totalDonation",
      key: "totalDonation",
      render: (amount) => (
        <div className="font-medium text-blue-600">
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a, b) => a.totalDonation - b.totalDonation,
    },
    {
      title: "Đã chi tiêu",
      dataIndex: "totalExpenses",
      key: "totalExpenses",
      render: (amount) => (
        <div className="font-medium text-orange-600">
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a, b) => a.totalExpenses - b.totalExpenses,
    },
    {
      title: "Số dư",
      dataIndex: "remainingFunds",
      key: "remainingFunds",
      render: (balance) => (
        <div
          className={`font-bold ${
            balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(balance)}
        </div>
      ),
      sorter: (a, b) => a.remainingFunds - b.remainingFunds,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record) => {
        const isGoalMet = record.totalDonation >= record.donationGoal;
        return (
          <span
            className={`font-bold px-2 py-1 rounded-md ${
              isGoalMet
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isGoalMet ? "Đã đủ mục tiêu" : "Chưa đủ mục tiêu"}
          </span>
        );
      },
      sorter: (a, b) =>
        (a.totalDonation >= a.donationGoal ? 1 : -1) -
        (b.totalDonation >= b.donationGoal ? 1 : -1),
    },
    {
      title: "Tỷ lệ sử dụng",
      key: "usage",
      render: (record) => (
        <div className="w-full">
          <Progress
            percent={Math.min(100, Math.round(record.usagePercentage))}
            size="small"
            status={record.balance < 0 ? "exception" : "normal"}
            format={(percent) => <span className="text-xs">{percent}%</span>}
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            trailColor="#f5f5f5"
          />
        </div>
      ),
    },
  ];

  // Table columns configuration
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
        if (!pet || typeof pet !== "object") return "Không xác định"; // Handle missing data
        return (
          <div className="flex items-center space-x-2">
            <img
              src={pet.image_url?.[0]?.[0] || "https://via.placeholder.com/40"}
              alt={pet.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{pet.name}</span>
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
        return record.type?._id === value; // Compare with the type ID
      },
      render: (type) => {
        if (!type || typeof type !== "object") return "Không xác định"; // Prevent errors
        return <Tag color={type.color}>{type.name}</Tag>; // Show type name
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
      ellipsis: true,
      render: (status) => {
        if (status === "Pending") {
          return <Tag color="blue">Chờ duyệt</Tag>;
        } else if (status === "Waiting for Review") {
          return <Tag color="yellow">Cần kiểm tra hóa đơn</Tag>;
        } else if (status === "Receipt Pending") {
          return <Tag color="orange">Đang chờ hóa đơn</Tag>;
        } else if (status === "Completed") {
          return <Tag color="green">Hoàn thành</Tag>;
        } else {
          return <Tag color="red">Từ chối</Tag>;
        }
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
            onClick={() => setSelectedReceipt(receipt)}
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
          {record.status === "Pending" && (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={() => showConfirmationModal(record._id, "approve")}
                type="link"
                style={{ color: "green" }}
              />
              <Button
                icon={<CloseOutlined />}
                onClick={() => showConfirmationModal(record._id, "reject")}
                type="link"
                style={{ color: "red" }}
              />
            </>
          )}
          {record.status === "Waiting for Review" && (
            <>
              <Button
                icon={<EyeOutlined />}
                onClick={() => setSelectedReceipt(record.receipt)}
                type="link"
                style={{ color: "blue" }}
              />
              <Button
                icon={<CheckOutlined />}
                onClick={() => showConfirmationModal(record._id, "verify")}
                type="link"
                style={{ color: "green" }}
              />
              <Button
                icon={<CloseOutlined />}
                onClick={() =>
                  showConfirmationModal(record._id, "reject-verification")
                }
                type="link"
                style={{ color: "red" }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="flex items-center gap-3 text-gray-800">
            <PawPrint className="w-10 h-10 text-pink-500" />
            Duyệt chi tiêu
          </Title>
        </div>

        {/* Financial Overview */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <PawPrint className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-800">
                Tổng quan tài chính
              </span>
            </div>
          }
          className="shadow-md rounded-lg mb-6"
        >
          <Table
            columns={financeColumns}
            dataSource={calculatePetFinances()}
            pagination={{
              current: petPage,
              pageSize: petPageSize,
              total: petTotal,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} thú cưng`,
              pageSizeOptions: ["5", "10", "20", "50"],
              position: ["bottomCenter"],
              className: "my-custom-pagination",
            }}
            onChange={handlePetTableChange}
            loading={petLoading}
            className="mb-6"
            rowClassName={(record) =>
              record.balance < 0 ? "bg-red-50/50" : "hover:bg-pink-50/50"
            }
          />
        </Card>

        {/* Expenses Table */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <DollarOutlined className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-gray-800">
                Danh sách chi tiêu cho thú cưng
              </span>
            </div>
          }
          className="shadow-md rounded-lg"
        >
          <Table
            columns={columns}
            dataSource={expenses.sort((a, b) => {
              if (a.status === "Pending" && b.status !== "Pending") return -1;
              if (b.status === "Pending" && a.status !== "Pending") return 1;
              return 0;
            })}
            pagination={{
              current: expensePage,
              pageSize: expensePageSize,
              total: totalExpenses,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng số ${total} chi tiêu`,
              pageSizeOptions: ["5", "10", "20", "50"],
              position: ["bottomCenter"],
              className: "my-custom-pagination",
            }}
            onChange={handleExpenseTableChange}
            loading={expenseLoading}
            rowKey="_id"
            rowClassName={(record) =>
              record.balance < 0 ? "bg-red-50/50" : "hover:bg-pink-50/50"
            }
          />
        </Card>
      </div>

      <Modal
        title="Xác nhận"
        open={approvalConfirmation.visible}
        onOk={handleConfirmation}
        onCancel={handleCancelConfirmation}
      >
        {approvalConfirmation.action === "approve" && (
          <p>Bạn có chắc chắn muốn duyệt chi tiêu này không?</p>
        )}
        {approvalConfirmation.action === "reject" && (
          <p>Bạn có chắc chắn muốn từ chối chi tiêu này không?</p>
        )}
        {approvalConfirmation.action === "verify" && (
          <p>Bạn có chắc chắn muốn xác minh chi tiêu này không?</p>
        )}
        {approvalConfirmation.action === "reject-verification" && (
          <p>Bạn có chắc chắn muốn từ chối xác minh chi tiêu này không?</p>
        )}
      </Modal>
      <Modal
        open={!!selectedReceipt}
        footer={null}
        onCancel={() => setSelectedReceipt(null)}
        width="80%"
        style={{ maxWidth: "800px" }}
      >
        {selectedReceipt && (
          <img
            src={selectedReceipt}
            alt="Hóa đơn chi tiết"
            className="w-full object-contain"
          />
        )}
      </Modal>
    </div>
  );
}

export default ApproveExpense;
