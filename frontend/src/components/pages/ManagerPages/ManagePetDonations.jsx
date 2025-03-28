/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Modal,
  message,
  Typography,
  Progress,
  Collapse,
  Avatar,
  Input,
  Button,
} from "antd";
import {
  CaretRightOutlined,
  HeartOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { PawPrint } from "lucide-react";
import { getPetsHomePage, updatePetDonationGoal } from "@/apis/pet";

const { Title, Text } = Typography;

function ManagePetDonations() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

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

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Handle pagination change
  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Open donation goal modal
  const openDonationGoalModal = (pet) => {
    setEditingPet({
      ...pet,
      newDonationGoal: pet.donationGoal || 0,
    });
  };

  // Handle donation goal update
  const handleUpdateDonationGoal = async () => {
    try {
      const numericGoal = Number(editingPet.newDonationGoal);
      if (isNaN(numericGoal) || numericGoal < 0) {
        message.error("Mục tiêu quyên góp không hợp lệ!");
        return;
      }

      const res = await updatePetDonationGoal(editingPet._id, numericGoal);
      if (res.status !== 200) {
        throw new Error("Update failed");
      }

      // Update local state
      setPets(
        pets.map((pet) =>
          pet._id === editingPet._id
            ? { ...pet, donationGoal: numericGoal }
            : pet
        )
      );

      message.success("Mục tiêu quyên góp đã được cập nhật!");
      setEditingPet(null);
    } catch (error) {
      console.error("Update error:", error);
      message.error("Cập nhật không thành công!");
    }
  };

  // Donation goal columns
  const donationColumns = [
    {
      title: "Thú cưng",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={
              record.image_url?.[0]?.[0] || "https://via.placeholder.com/150"
            }
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
      title: "Mục tiêu hiện tại",
      dataIndex: "donationGoal",
      key: "donationGoal",
      render: (amount) => (
        <div className="font-medium text-pink-600">
          {formatCurrency(amount || 0)}
        </div>
      ),
    },
    {
      title: "Tổng donate",
      dataIndex: "totalDonation",
      key: "totalDonation",
      render: (amount) => (
        <div className="font-medium text-blue-600">
          {formatCurrency(amount || 0)}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record) => (
        <div className="w-full">
          <Progress
            percent={
              record.totalDonation
                ? Math.min(
                    100,
                    Math.round(
                      (record.totalDonation / record.donationGoal) * 100
                    )
                  )
                : 0
            }
            size="small"
            status={
              record.totalDonation >= record.donationGoal ? "success" : "active"
            }
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
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <Button
          type="primary"
          className="bg-pink-500 hover:bg-pink-600"
          onClick={() => openDonationGoalModal(record)}
        >
          Chỉnh sửa mục tiêu
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-pink-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="w-8 h-8 text-pink-500" />
        <Title level={2} className="mb-0 text-gray-800">
          Quản lý mục tiêu quyên góp
        </Title>
      </div>

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
            columns={donationColumns}
            dataSource={pets}
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

      {/* Donation Goal Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <DollarCircleOutlined className="text-pink-500" />
            <span>Chỉnh sửa mục tiêu quyên góp</span>
          </div>
        }
        open={!!editingPet}
        onCancel={() => setEditingPet(null)}
        footer={[
          <Button key="back" onClick={() => setEditingPet(null)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-pink-500 hover:bg-pink-600"
            onClick={handleUpdateDonationGoal}
          >
            Cập nhật
          </Button>,
        ]}
      >
        {editingPet && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src={
                  editingPet.image_url?.[0]?.[0] ||
                  "https://via.placeholder.com/150"
                }
                size={64}
                className="border-2 border-pink-200"
              />
              <div>
                <Text strong className="text-lg">
                  {editingPet.name}
                </Text>
                <div className="text-sm text-gray-500">
                  {editingPet.description}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Text>Mục tiêu quyên góp hiện tại:</Text>
              <Text strong className="ml-2 text-pink-600">
                {formatCurrency(editingPet.donationGoal || 0)}
              </Text>
            </div>

            <Input
              type="number"
              value={editingPet.newDonationGoal}
              onChange={(e) =>
                setEditingPet({
                  ...editingPet,
                  newDonationGoal: Number(e.target.value),
                })
              }
              placeholder="Nhập mục tiêu quyên góp mới"
              prefix={<DollarCircleOutlined className="text-pink-500" />}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManagePetDonations;
