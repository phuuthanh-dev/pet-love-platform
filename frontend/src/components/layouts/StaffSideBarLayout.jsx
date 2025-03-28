import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
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
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { TbDogBowl } from "react-icons/tb";
import { LuDog } from "react-icons/lu";
import { BsPostcard } from "react-icons/bs";
import { PiPawPrintLight } from "react-icons/pi";
import { GoNote } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { MdOutlinePostAdd } from "react-icons/md";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const { Header, Sider, Content } = Layout;

const StaffSideBarLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const menuItems = [
    {
      key: "/adopt",
      icon: <IoHomeOutline className="w-4 h-4" />,
      label: "Trang chủ",
      roles: ["services_staff"],
    },
    {
      key: "/forum",
      icon: <IoHomeOutline className="w-4 h-4" />,
      label: "Trang chủ",
      roles: ["forum_staff"],
    },
    {
      key: "/staff-services/approvePet",
      icon: <PiPawPrintLight className="w-4 h-4" />,
      label: "Tiếp nhận thú cưng",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/managePet",
      icon: <LuDog className="w-4 h-4" />,
      label: "Thú cưng",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/manageAdoptionPost",
      icon: <BsPostcard className="w-4 h-4" />,
      label: "Bài đăng",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/manageAdoptionForms",
      icon: <TbDogBowl className="w-4 h-4" />,
      label: "Nhận nuôi",
      roles: ["services_staff"],
    },
    {
      key: "/staff-services/manageExpenses",
      icon: <GoNote className="w-4 h-4" />,
      label: "Quản lý chi tiêu",
      roles: ["services_staff"],
    },
    {
      key: "/staff-forum/manageBlog",
      icon: <MdOutlinePostAdd className="w-5 h-5" />,
      label: "Blogs",
      roles: ["forum_staff"],
    },
    {
      key: "/staff-forum/managePost",
      icon: <GoNote className="w-4 h-4" />,
      label: "Quản lý bài đăng",
      roles: ["forum_staff"],
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span className="text-red-500">Đăng xuất</span>,
    },
  ];

  const userRole = user.role;
  const filteredItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

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
          <div className="flex justify-center items-center h-16">
            <Link to="/">
              <img
                src="/assets/images/logo.png"
                alt="logo"
                className="w-10 h-10 transition-all duration-300"
              />
            </Link>
          </div>
          {/* Menu chính */}
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
            items={filteredItems}
            className="flex-1"
            style={{
              background: "transparent",
              borderRight: "none",
            }}
          />
        </div>
      </Sider>

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
            {location.pathname === "/adopt" && "Trang chủ"}
            {location.pathname === "/forum" && "Trang chủ"}
            {location.pathname === "/staff-services/approvePet" &&
              "Tiếp nhận thú cưng"}
            {location.pathname === "/staff-services/managePet" && "Thú cưng"}
            {location.pathname === "/staff-services/manageAdoptionPost" &&
              "Bài đăng"}
            {location.pathname === "/staff-services/manageAdoptionForms" &&
              "Nhận nuôi"}
            {location.pathname === "/staff-services/manageExpenses" &&
              "Quản lý chi tiêu"}
            {location.pathname === "/staff-forum/manageBlog" && "Blogs"}
            {location.pathname === "/staff-forum/managePost" &&
              "Quản lý bài đăng"}
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
                  <div className="text-xs text-gray-500">
                    {user.role === "services_staff"
                      ? "Services Staff"
                      : "Forum Staff"}
                  </div>
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

export default StaffSideBarLayout;
