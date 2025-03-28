import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";
import { Avatar, Dropdown, Modal } from "antd";
import {
  Menu,
  Search,
  MessageCircle,
  PawPrintIcon,
  LogOut,
  SquareKanban,
} from "lucide-react";
import { Button } from "../ui/button";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function Header() {
  const clientSetting = useSelector((state) => state.setting.clientSetting);
  const logo = clientSetting?.find((item) => item.name === "Logo")?.value;
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      key: "profile",
      label: <NavLink to={`/profile/${user?.username}`}>Hồ sơ</NavLink>,
      icon: <PawPrintIcon size={16} />,
    },
    user?.role.includes("manager") && {
      key: "managerStaff",
      label: "Manager",
      onClick: () => navigate("/manager"),
      icon: <SquareKanban size={16} />,
    },
    user?.role.includes("services_staff") && {
      key: "approvePet",
      label: "Services Staff",
      onClick: () => navigate("/staff-services/approvePet"),
      icon: <MessageCircle size={16} />,
    },
    user?.role.includes("forum_staff") && {
      key: "manageBlog",
      label: "Forum Staff",
      onClick: () => navigate("/staff-forum/managePost"),
      icon: <Menu size={16} />,
    },
    user?.role.includes("admin") && {
      key: "dashboard",
      label: "DashBoard",
      onClick: () => navigate("/admin/"),
      icon: <Search size={16} />,
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
      icon: <LogOut size={16} />,
    },
  ].filter(Boolean);

  return (
    <header
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md bg-white/95 backdrop-blur-sm" : "bg-white"
      }`}
    >
      <div className="mx-auto flex justify-between items-center h-20 px-4 md:px-10">
        {/* Logo */}
        <div id="logo" className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 relative">
              <img src={logo} alt="PetPals" className="object-contain h-full" />
            </div>
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
            size="icon"
            className="text-gray-700"
          >
            <Menu size={24} />
          </Button>
        </div>

        {/* Navbar - Desktop */}
        <div className="hidden md:flex gap-6 lg:gap-12 h-full">
          <Navbar />
        </div>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {!user ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={() => navigate("/signup")}
              >
                Đăng ký
              </Button>
            </div>
          ) : (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <div className="flex items-center gap-2 cursor-pointer group p-2 rounded-full hover:bg-gray-100">
                <Avatar
                  size={40}
                  icon={<img src={user.profilePicture} alt={user.username} />}
                  className="border-2 border-pink-200 group-hover:border-pink-400 transition-all"
                />
                <span className="font-medium text-gray-700 hidden lg:inline">
                  {user.username}
                </span>
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="px-4 py-2">
            <Navbar />
          </div>
          <div className="flex justify-between items-center px-4 py-4 border-t border-gray-100">
            {!user ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  Đăng ký
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar
                    size={36}
                    icon={<img src={user.profilePicture} alt={user.username} />}
                    className="border-2 border-pink-200"
                  />
                  <span className="font-medium text-gray-700">
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
