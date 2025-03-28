/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  message,
  Typography,
  Progress,
  Collapse,
  Avatar,
  Card,
  Timeline,
  Tabs,
} from "antd";
import {
  CaretRightOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { PawPrint } from "lucide-react";
import { getPetsHomePage } from "@/apis/pet";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function ManageExpense() {
  const [pets, setPets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Fetch pets data
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await getPetsHomePage(page, pageSize);
        setPets(response.data.data.results);
        setTotal(response.data.data.totalResults);
      } catch (error) {
        console.error("Error fetching pets:", error);
        message.error("Không thể tải danh sách thú cưng");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
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

  // Calculate financial status for each pet
  const calculatePetFinances = () => {
    return pets.map((pet) => {
      const usagePercentage = (pet.totalExpenses / pet.totalDonation) * 100;
      return {
        key: pet._id,
        name: pet.name,
        image: pet.image_url?.[0]?.[0] || "https://via.placeholder.com/150",
        totalDonation: pet.totalDonation,
        donationGoal: pet.donationGoal,
        totalExpenses: pet.totalExpenses,
        remainingFunds: pet.remainingFunds,
        usagePercentage: usagePercentage,
        description: pet.description,
        expenses: pet.expenses || [], // Assuming you have expense history
      };
    });
  };

  const showPetDetail = (pet) => {
    setSelectedPet(pet);
    setIsModalVisible(true);
  };

  // Financial overview columns
  const financeColumns = [
    {
      title: "Thú cưng",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-all"
          onClick={() => showPetDetail(record)}
        >
          <Avatar
            src={record.image}
            size={64}
            className="border-2 border-pink-200"
          />
          <div>
            <Text strong className="text-lg text-gray-800 hover:text-pink-600">
              {name}
            </Text>
            <div className="text-sm text-gray-500 mt-1">
              {record.description?.substring(0, 50)}...
            </div>
          </div>
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

  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPet(null);
  };

  const PetDetailModal = ({ pet, visible, onCancel }) => {
    if (!pet) return null;

    return (
      <Modal
        open={visible}
        onCancel={onCancel}
        width={800}
        footer={null}
        className="pet-detail-modal"
      >
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={pet.image}
              size={100}
              className="border-4 border-pink-200"
            />
            <div>
              <Title level={3} className="mb-1">
                {pet?.name}
              </Title>
              <Text className="text-gray-600">{pet.description}</Text>
            </div>
          </div>

          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <DollarCircleOutlined />
                  Thông tin tài chính
                </span>
              }
              key="1"
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-gradient-to-r from-pink-50 to-white">
                  <Text className="text-pink-600">Mục tiêu quyên góp</Text>
                  <div className="text-2xl font-bold mt-2">
                    {formatCurrency(pet.donationGoal)}
                  </div>
                </Card>
                <Card className="bg-gradient-to-r from-blue-50 to-white">
                  <Text className="text-blue-600">Đã quyên góp</Text>
                  <div className="text-2xl font-bold mt-2">
                    {formatCurrency(pet.totalDonation)}
                  </div>
                </Card>
                <Card className="bg-gradient-to-r from-orange-50 to-white">
                  <Text className="text-orange-600">Tổng chi tiêu</Text>
                  <div className="text-2xl font-bold mt-2">
                    {formatCurrency(pet.totalExpenses)}
                  </div>
                </Card>
                <Card className="bg-gradient-to-r from-green-50 to-white">
                  <Text className="text-green-600">Số dư</Text>
                  <div className="text-2xl font-bold mt-2">
                    {formatCurrency(pet.remainingFunds)}
                  </div>
                </Card>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Lịch sử chi tiêu
                </span>
              }
              key="2"
            >
              <Timeline mode="left">
                {pet.expenses?.map((expense, index) => (
                  <Timeline.Item
                    key={index}
                    color={expense.status === "Approved" ? "green" : "blue"}
                    label={
                      <div>
                        <span>
                          {dayjs(expense.date).format("DD/MM/YYYY hh:mm:ss")}
                        </span>
                        <br />
                        <span className="text-black-600">
                          Created by:{"  "}
                          <span className="font-semibold text-gray-800">
                            {expense.createdBy?.username}
                          </span>
                        </span>
                        <br />
                        <span
                          className={`text-${
                            expense?.status === "Pending"
                              ? "blue"
                              : expense?.status === "Completed"
                              ? "green"
                              : expense?.status === "Receipt Pending"
                              ? "orange"
                              : expense?.status === 'Waiting for Review'
                              ? "yellow"
                              : "red"
                          }-500 text-sm`}
                        >
                          {expense?.status === "Pending"
                            ? "Chờ duyệt"
                            : expense?.status === "Completed"
                            ? "Đã hoàn thành"
                            : expense?.status === "Receipt Pending"
                            ? "Chờ hóa đơn"
                            : expense?.status === 'Waiting for Review'
                            ? "Chờ kiểm tra hóa đơn"
                            : "Từ chối"}
                        </span>
                      </div>
                    }
                  >
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium">{expense.type?.name}</div>
                      <div className="text-orange-600 font-bold">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {expense.note}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2} className="flex items-center gap-3">
          <PawPrint className="w-8 h-8 text-pink-500" />
          Quản lý chi tiêu thú cưng
        </Title>
      </div>

      {/* Financial Overview */}
      <Collapse
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            className="text-pink-500"
          />
        )}
        className="bg-white rounded-lg overflow-hidden border border-pink-100 shadow-sm"
      >
        <Collapse.Panel
          header={
            <div className="flex items-center gap-2 py-1">
              <HeartOutlined className="text-pink-500" />
              <span className="text-lg font-semibold text-gray-800">
                Danh sách thú cưng
              </span>
            </div>
          }
          key="1"
          className="bg-gradient-to-r from-pink-50/50 to-white"
        >
          <Table
            columns={financeColumns}
            dataSource={calculatePetFinances()}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} thú cưng`,
              pageSizeOptions: ["5", "10", "20", "50"],
              position: ["bottomCenter"],
              className: "my-custom-pagination",
            }}
            onChange={handleTableChange}
            loading={loading}
            className="mb-6"
            rowClassName="hover:bg-pink-50/50 transition-colors"
          />
        </Collapse.Panel>
      </Collapse>

      <PetDetailModal
        pet={selectedPet}
        visible={isModalVisible}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default ManageExpense;
