import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  GiftOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Badge,
  Tooltip,
  Dropdown,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { BellElectric, Caravan, PawPrintIcon } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";

const { Header, Sider, Content } = Layout;

const ManagerLayout = () => {
  const { user } = useSelector((store) => store.auth);
  const clientSetting = useSelector((state) => state.setting.clientSetting);
  const logo = clientSetting?.find((item) => item.name === "Logo")?.value;
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý logout
  const handleLogout = async () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleOutlined style={{ color: "#FAAD14" }} />,
      content: "You will need to log in again to access your account.",
      okText: "Yes, Logout",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const res = await handleLogoutAPI();
          if (res.status === 200) {
            dispatch(setAuthUser(null));
            dispatch(setSelectedPost(null));
            dispatch(setPosts([]));
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/");
            toast.success(res.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },
    });
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <UserOutlined />,
      onClick: () => navigate(`/profile/${user?.username}`),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-full"
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          background: "linear-gradient(180deg, #252A3F 0%, #1A1D2E 100%)",
          zIndex: 10,
        }}
        width={240}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex justify-center items-center h-16 py-4 relative">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="logo"
                className="w-10 h-10 transition-all duration-300"
              />
              {!collapsed && (
                <>
                  <span className="text-white font-bold text-xl ml-2">
                    PetAdmin
                  </span>
                  <PawPrintIcon className="absolute right-4 top-3 text-blue-400 w-4 h-4 transform rotate-12" />
                </>
              )}
            </Link>
          </div>

          {/* Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              if (key === "logout") {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: "/forum",
                icon: <IoHomeOutline />,
                label: "Trang chủ",
              },
              {
                key: "/manager",
                icon: <PieChartOutlined />,
                label: "Bảng điều khiển",
              },
              {
                key: "/manager/donate",
                icon: <GiftOutlined />,
                label: "Danh sách quyên góp",
              },
              {
                key: "/manager/campaign",
                icon: (
                  <div style={{ position: "relative" }}>
                    <Caravan style={{ width: 16, height: 16 }} />
                  </div>
                ),
                label: "Chiến dịch",
              },
              {
                key: "/manager/pets-donation",
                icon: <PawPrintIcon style={{ width: 16, height: 16 }} />,
                label: "Thú cưng",
              },
              {
                key: "/manager/approve-expense",
                icon: <BellElectric size={16} />,
                label: "Duyệt chi tiêu",
              },
              {
                key: "/manager/expense",
                icon: <DollarOutlined />,
                label: "Quản lý chi tiêu",
              },
            ]}
            style={{
              background: "transparent",
              borderRight: "none",
            }}
            className="flex-1"
          />

          {/* Logout button */}
          <Menu
            theme="dark"
            mode="inline"
            style={{
              background: "transparent",
              borderRight: "none",
              marginTop: "auto",
              marginBottom: "16px",
            }}
            items={[
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span className="text-red-400">Đăng xuất</span>,
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="h-full">
        {/* Header */}
        <Header
          style={{
            background: colorBgContainer,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Nút thu gọn/mở rộng Sidebar */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-10 h-10 flex items-center justify-center"
            style={{
              borderRadius: "50%",
              marginRight: "24px",
              color: colorPrimary,
            }}
          />

          {/* Breadcrumb or page title placeholder */}
          <div className="font-semibold text-lg">
            {location.pathname === "/manager/" && "Bảng điều khiển"}
            {location.pathname === "/manager/donate" && "Quản lý quyên góp"}
            {location.pathname === "/manager/campaign" && "Quản lý chiến dịch"}
          </div>

          {/* Right side items */}
          <div className="ml-auto flex items-center gap-4">
            {/* Date & Time */}
            <div className="hidden md:block mr-4">
              <div className="text-xs text-gray-500">
                {currentTime.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="text-sm font-medium">
                {currentTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Search */}
            <Tooltip title="Tìm kiếm">
              <Button type="text" shape="circle" icon={<SearchOutlined />} />
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Thông báo">
              <Badge count={3} size="small">
                <Button type="text" shape="circle" icon={<BellOutlined />} />
              </Badge>
            </Tooltip>

            {/* Avatar with dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center cursor-pointer">
                <Avatar
                  size={40}
                  src={user.profilePicture}
                  style={{
                    border: "2px solid #E6F7FF",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="ml-2 hidden md:block">
                  <div className="text-sm font-medium">{user.username}</div>
                  <div className="text-xs text-gray-500">Manager</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          className="p-6 overflow-auto"
          style={{
            background: "#F5F7FA",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div
            style={{
              background: colorBgContainer,
              padding: "24px",
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              minHeight: "calc(100vh - 116px)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
