import { useEffect, useState } from "react";
import { Card, Table, Statistic, Row, Col } from "antd";
import { Line } from "react-chartjs-2";
import { getStatsAPI } from "@/apis/admin";
import { getTop5DonateAPI } from "@/apis/donate";
import { formatVND } from "@/utils/formatVND";
import {
  UserOutlined,
  HeartOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { PawPrint, PawPrintIcon, UserPen, UserSearch } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [months, setMonths] = useState([]);
  const [totalDonations, setTotalDonations] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalForumStaffs, setTotalForumStaffs] = useState(0);
  const [totalServiceStaffs, setTotalServiceStaffs] = useState(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [totalsPetNotAdopted, setTotalsPetNotAdopted] = useState(0);
  const [prevMonthTotal, setPrevMonthTotal] = useState(0);
  const [top5, setTop5] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const prevMonthIndex =
    new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1;
  const prevMonthName = new Date(
    new Date().setMonth(prevMonthIndex)
  ).toLocaleString("en-US", {
    month: "long",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const { data } = await getStatsAPI();
        setTotalUsers(data?.data?.user || 0);
        setTotalForumStaffs(data?.data?.numberForumStaff || 0);
        setTotalServiceStaffs(data?.data?.numberServiceStaff || 0);
        setTotalsPetNotAdopted(data?.data?.totalsPetNotAdopted || 0);

        const donationsData = data?.data?.donations || [];
        const donationsMap = new Map(
          donationsData.map((item) => [item.month, item.total])
        );

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const orderedDonations = monthNames.map(
          (month) => donationsMap.get(month) || 0
        );
        setMonths(monthNames);
        setTotalDonations(orderedDonations);
        setCurrentMonthTotal(donationsMap.get(currentMonthName) || 0);
        setPrevMonthTotal(donationsMap.get(prevMonthName) || 0);
      } catch (error) {
        toast.error("Error fetching stats:", error);
      }
    };

    const fetchTopDonators = async () => {
      try {
        const { data } = await getTop5DonateAPI();
        setTop5(data?.data || []);
      } catch (error) {
        toast.error("Error fetching top 5 donors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    fetchTopDonators();
  }, [currentMonthName]);

  const growthPercentage =
    prevMonthTotal > 0
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
      : 100;

  const donationsData = {
    labels: months,
    datasets: [
      {
        label: "Quyên góp hàng tháng",
        data: totalDonations,
        borderColor: "rgba(79, 129, 232, 1)",
        backgroundColor: "rgba(79, 129, 232, 0.1)",
        pointBackgroundColor: "rgba(79, 129, 232, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Segoe UI', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
        padding: 12,
        borderColor: "rgba(79, 129, 232, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatVND(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return value >= 1000000
              ? (value / 1000000).toFixed(0) + "M"
              : value;
          },
        },
      },
    },
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: ["user", "username"],
      key: "username",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          {record.user?.profilePicture && (
            <Link to={`/profile/${record.user?.username}`}>
              <Avatar
                className={`w-8 h-8 ${
                  user?.id === record.user?.id ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ border: "1px solid #e0e0e0" }}
              >
                <AvatarImage
                  src={record.user?.profilePicture}
                  alt="post_image"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          )}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Số tiền quyên góp (VNĐ)",
      dataIndex: "totalAmount",
      key: "amount",
      render: (amount) => (
        <div className="font-medium text-right">{formatVND(amount)}</div>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      defaultSortOrder: "descend",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <PawPrintIcon className="mr-2 text-blue-500" />
          Bảng điều khiển
        </h1>
        <div className="text-gray-400 text-sm">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {user?.role === "admin" && (
          <>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Tổng số thành viên
                    </div>
                  }
                  value={totalUsers}
                  prefix={<UserOutlined className="text-blue-500 mr-2" />}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Tổng số nhân viên diễn đàn
                    </div>
                  }
                  value={totalForumStaffs}
                  prefix={<UserSearch className="text-blue-500 mr-2" />}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Tổng số nhân viên dịch vụ
                    </div>
                  }
                  value={totalServiceStaffs}
                  prefix={<UserPen className="text-blue-500 mr-2" />}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
          </>
        )}
        {user?.role === "manager" && (
          <>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Quyên góp tháng {currentMonthName}
                    </div>
                  }
                  value={currentMonthTotal}
                  formatter={(value) => formatVND(value)}
                  prefix={<HeartOutlined className="text-pink-500 mr-2" />}
                  valueStyle={{
                    color: "#cf1322",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <div
                  className={`mt-4 p-2 rounded text-sm ${
                    growthPercentage >= 0
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {growthPercentage >= 0 ? (
                    <RiseOutlined />
                  ) : (
                    <RiseOutlined style={{ transform: "rotate(180deg)" }} />
                  )}
                  {growthPercentage.toFixed(1)}% so với tháng trước
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Tổng quyên góp cả năm
                    </div>
                  }
                  value={totalDonations.reduce((sum, val) => sum + val, 0)}
                  formatter={(value) => formatVND(value)}
                  prefix={<TrophyOutlined className="text-yellow-500 mr-2" />}
                  valueStyle={{
                    color: "#9254de",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-purple-50 p-2 rounded text-sm text-yellow-700">
                  <PawPrintIcon className="inline-block w-4 h-4 mr-1" /> Hỗ trợ
                  cho các bé thú cưng
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={false}
                className="h-full shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <Statistic
                  title={
                    <div className="text-lg font-medium">
                      Số thú cưng chưa được nhận nuôi
                    </div>
                  }
                  value={totalsPetNotAdopted}
                  prefix={<PawPrint className="text-orange-500 mr-2" />}
                  valueStyle={{
                    color: "orange",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                />
                <div className="mt-4 bg-gradient-to-r from-orange-50 to-purple-50 p-2 rounded text-sm text-yellow-700">
                  <PawPrintIcon className="inline-block w-4 h-4 mr-1" /> 
                  Hãy giúp đỡ các bé thú cưng
                </div>
              </Card>
            </Col>
          </>
        )}
      </Row>
      {user?.role === "manager" && (
        <Row gutter={[16, 16]} className="mt-4">
          <Col span={16}>
            <Card
              title={
                <div className="text-lg font-medium">Quyên góp hàng tháng</div>
              }
              bordered={false}
              className="shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: "12px", overflow: "hidden" }}
              loading={isLoading}
            >
              <div style={{ height: "400px" }}>
                <Line data={donationsData} options={chartOptions} />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <div className="flex items-center">
                  <TrophyOutlined className="text-yellow-500 mr-2" />
                  <span className="text-lg font-medium">
                    Top 5 Người quyên góp
                  </span>
                </div>
              }
              bordered={false}
              className="shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: "12px", overflow: "hidden" }}
              loading={isLoading}
            >
              <Table
                dataSource={top5}
                columns={columns}
                pagination={false}
                rowKey={(record) => record.user._id}
                showHeader={false}
                rowClassName={(record, index) =>
                  index === 0
                    ? "bg-yellow-50"
                    : index === 1
                    ? "bg-gray-50"
                    : index === 2
                    ? "bg-orange-50"
                    : ""
                }
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
