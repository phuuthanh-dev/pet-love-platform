import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Avatar } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";
import { PiPawPrintLight } from "react-icons/pi";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-full"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-3 text-white text-center font-bold">
            Staff Services Panel
          </div>

          {/* Menu chính */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]} // Đánh dấu menu active theo URL
            onClick={({ key }) => {
              if (key === "logout") {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: "/staff/approvePet",
                icon: <PiPawPrintLight className="w-4 h-4" />,
                label: "Approve Pet",
              },
              {
                key: "/staff/managePet",
                icon: <MdOutlineManageAccounts className="w-4 h-4" />,
                label: "Manage Pet",
              },

              { type: "divider" }, // Dòng phân cách
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span className="text-red-500">Logout</span>, // Màu đỏ để nổi bật
              },
            ]}
            className="flex-1"
          />
        </div>
      </Sider>

      <Layout className="h-full">
        <Header className="bg-white shadow-md px-4 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-12 h-12"
          />
          <marquee scrollAmount="12" className="text-xl font-bold mx-8">
            Welcome Staff, Have a nice day!
          </marquee>
          {/* Avatar */}
          <div className="ml-auto">
            <Avatar size="large" src="https://i.pravatar.cc/150" />
          </div>
        </Header>

        {/* Content */}
        <Content
          className="p-6 bg-gray-100 overflow-auto"
          style={{
            borderRadius: borderRadiusLG,
            height: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
