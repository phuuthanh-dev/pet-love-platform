import {
  Dog,
  Heart,
  Home,
  LogOut,
  PlusSquare,
  Search,
  PawPrint,
  HandHeart,
} from "lucide-react";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import {
  setIsDisplayText,
  setShowNotificationTab,
  setShowSearchTab,
} from "@/redux/sidebarSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { handleLogoutAPI } from "@/apis/auth";
import { RiMessengerLine, RiMessengerFill } from "react-icons/ri";
import { FaHeart, FaSearch } from "react-icons/fa";
import TabNotification from "./TabNotification";
import TabSearch from "./TabSearch";
import CreatePost from "../features/posts/CreatePost";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const getInitialActiveTab = () => {
  const pathname = window.location.pathname;
  if (pathname === "/") return "Home";
  if (pathname.includes("/profile")) return "Profile";
  if (pathname.includes("/adopt")) return "Adopt";
  if (pathname.includes("/forum")) return "Forum";
  if (pathname.includes("/chat")) return "Messages";
  return "Home"; // fallback
};

const LeftSidebar = () => {
  const clientSetting = useSelector((state) => state.setting.clientSetting);
  const logo = clientSetting?.find((item) => item.name === "Logo")?.value;
  const logo2 = clientSetting?.find((item) => item.name === "Logo2")?.value;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("340px");
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const { isDisplayText, showSearchTab, showNotificationTab } = useSelector(
    (store) => store.sidebar
  );
  const userRole = user?.role;

  const logoutHandler = async () => {
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

  const isActiveTab = (path) => {
    if (path === "Home") return location.pathname === "/";
    return activeTab === path;
  };

  const handleClickOutside = (event) => {
    // Kiểm tra click trong notification area
    const notificationArea = document.querySelector(".notification-area");
    const searchArea = document.querySelector(".search-area");
    if (
      (notificationArea && notificationArea.contains(event.target)) ||
      (searchArea && searchArea.contains(event.target))
    )
      return;

    if (location.pathname.includes("/chat/")) {
      setActiveTab("Messages");
      dispatch(setShowNotificationTab(false));
      dispatch(setShowSearchTab(false));
      return;
    }
    if (
      (activeTab === "Search" || activeTab === "Notifications") &&
      location.pathname.includes("/profile/")
    ) {
      setActiveTab("Profile");
      dispatch(setIsDisplayText(true));
      dispatch(setShowNotificationTab(false));
      dispatch(setShowSearchTab(false));
      return;
    }
    if (location.pathname.includes("/p/")) {
      dispatch(setShowNotificationTab(false));
      dispatch(setShowSearchTab(false));
      dispatch(setIsDisplayText(true));
      return;
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      dispatch(setShowNotificationTab(false));
      if (isActiveTab("Messages")) setActiveTab("Messages");
      else if (isActiveTab("Forum")) setActiveTab("Forum");
      else if (isActiveTab("Profile")) setActiveTab("Profile");
      else if (isActiveTab("Notifications")) setActiveTab("Notifications");
      else if (isActiveTab("Search")) setActiveTab("Search");
      else if (isActiveTab("Adopt")) setActiveTab("Adopt");
      else if (isActiveTab("SubmitPet")) setActiveTab("SubmitPet");
    }

    // Xử lý click outside cho search
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      dispatch(setShowSearchTab(false));
      if (isActiveTab("Messages")) setActiveTab("Messages");
      else if (isActiveTab("Forum")) setActiveTab("Forum");
      else if (isActiveTab("Profile")) setActiveTab("Profile");
      else if (isActiveTab("Notifications")) setActiveTab("Notifications");
      else if (isActiveTab("Search")) setActiveTab("Search");
      else if (isActiveTab("Adopt")) setActiveTab("Adopt");
      else if (isActiveTab("Pets")) setActiveTab("Pets");
    }

    const shouldDisplayText = !["Messages", "Notifications", "Search"].includes(
      activeTab
    );

    dispatch(setIsDisplayText(shouldDisplayText));
  };

  const updateSidebarState = () => {
    const pathMapping = {
      "/profile": "Profile",
      "/forum": "Forum",
      "/chat": "Messages",
      "/adopt": "Adopt",
      "/submitPet": "SubmitPet",
      "/pets": "Pets",
    };

    const activeKey = Object.keys(pathMapping).find((key) =>
      location.pathname.includes(key)
    );
    setActiveTab(pathMapping[activeKey]);

    const isChatPage = location.pathname.includes("/chat");
    setSidebarWidth(isChatPage ? "80px" : "340px");
    dispatch(setIsDisplayText(!isChatPage));
    dispatch(setShowNotificationTab(false));
  };

  const sidebarHandler = (textType) => {
    setActiveTab(textType);
    dispatch(setShowNotificationTab(false));
    dispatch(setShowSearchTab(false));

    const actions = {
      Logout: logoutHandler,
      Create: () => setOpen(true),
      Profile: () => navigate(`/profile/${user?.username}`),
      Forum: () => navigate("/forum"),
      Messages: () => navigate("/chat"),
      Home: () => navigate("/"),
      Pets: () => navigate("/pets"),
      Adopt: () => navigate("/adopt"),
      SubmitPet: () => navigate("/submitPet"),
      Notifications: () => {
        dispatch(setShowNotificationTab(true));
        dispatch(setIsDisplayText(false));
      },
      Search: () => {
        dispatch(setShowSearchTab(true));
        dispatch(setIsDisplayText(false));
      },
    };

    actions[textType]?.();
  };

  useEffect(updateSidebarState, [location.pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [location.pathname]);

  const sidebarItems = [
    { icon: <Home />, text: "Trang chủ", textType: "Home" },
    {
      icon: isActiveTab("Forum") ? (
        <MdForum size={24} />
      ) : (
        <MdOutlineForum size={24} />
      ),
      text: "Diễn đàn",
      textType: "Forum",
    },
    {
      icon: isActiveTab("Pets") ? (
        <Dog size={24} strokeWidth={3} />
      ) : (
        <Dog size={24} />
      ),
      text: "Thú cưng",
      textType: "Pets",
    },
    {
      icon: isActiveTab("Adopt") ? (
        <HandHeart size={24} strokeWidth={3} />
      ) : (
        <HandHeart size={24} />
      ),
      text: "Nhận nuôi",
      textType: "Adopt",
    },
    {
      icon: isActiveTab("SubmitPet") ? (
        <PawPrint size={24} strokeWidth={3} />
      ) : (
        <PawPrint size={24} />
      ),
      text: "Gửi thú cưng",
      textType: "SubmitPet",
    },
    {
      icon: isActiveTab("Search") ? <FaSearch size={24} /> : <Search />,
      text: "Tìm kiếm",
      textType: "Search",
    },
    // Only show these items if user exists
    ...(user
      ? [
          {
            icon: isActiveTab("Messages") ? (
              <RiMessengerFill size={24} />
            ) : (
              <RiMessengerLine size={24} />
            ),
            text: "Tin nhắn",
            textType: "Messages",
          },
          {
            icon: showNotificationTab ? <FaHeart size={24} /> : <Heart />,
            text: "Thông báo",
            textType: "Notifications",
          },
          { icon: <PlusSquare />, text: "Tạo", textType: "Create" },
          {
            icon: isActiveTab("Profile") ? (
              <Avatar className="w-6 h-6" style={{ border: "2px solid black" }}>
                <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar
                className="w-6 h-6"
                style={{ border: "1px solid #e0e0e0" }}
              >
                <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ),
            text: "Trang cá nhân",
            textType: "Profile",
          },
        ]
      : []),
  ];

  const allowedStaffItems = [
    "Home",
    "Forum",
    "Adopt",
    "Messages",
    "Notifications",
    "Create",
    "Profile",
    "Pets",
  ];

  const filteredSidebarItems =
    userRole !== "user"
      ? sidebarItems.filter((item) => allowedStaffItems.includes(item.textType))
      : sidebarItems;

  return (
    <div
      className={`h-screen sticky top-0 px-4`}
      style={{
        width: sidebarWidth,
        transition: "width 0.3s ease",
        paddingRight: "3px",
      }}
    >
      <div className="flex flex-col h-full border-r border-gray-300">
        <Link to="/" style={{ height: "120px" }}>
          <h1 className="my-8 pl-3 font-bold text-xl">
            {sidebarWidth === "340px" && isDisplayText ? (
              <img
                src={logo2}
                alt="logo"
                className="w-[50%]"
              />
            ) : (
              <img src={logo} alt="full logo" className="w-[24px]" />
            )}
          </h1>
        </Link>
        <div className="flex-grow">
          <div className="flex-grow">
            {filteredSidebarItems.map((item, index) => {
              return (
                <div
                  onClick={() => sidebarHandler(item.textType)}
                  key={index}
                  className={`flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3`}
                >
                  {item.icon}
                  {isDisplayText && (
                    <span
                      className={`${
                        isActiveTab(item.textType) ? "font-bold" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                  )}
                  {item.text === "Notifications" &&
                    likeNotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                          >
                            {likeNotification.length}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {likeNotification.length === 0 ? (
                              <p>No new notification</p>
                            ) : (
                              likeNotification.map((notification) => {
                                return (
                                  <div
                                    key={notification.userId}
                                    className="flex items-center gap-2 my-2"
                                  >
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                      />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm">
                                      <span className="font-bold">
                                        {notification.userDetails?.username}
                                      </span>{" "}
                                      liked your post
                                    </p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {user && (
          <div
            onClick={() => sidebarHandler("Logout")}
            className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 mb-8"
          >
            <LogOut />
            {isDisplayText && <span>Đăng xuất</span>}
          </div>
        )}
      </div>
      <div
        ref={notificationRef}
        className={`notification-area fixed top-0 left-[80px] h-screen border-l-gray-300 bg-white z-20 overflow-y-auto transition-width duration-300 ease-in-out ${
          showNotificationTab ? "w-[20%] border-x" : "w-0"
        }`}
      >
        <div className="h-full w-full">
          {showNotificationTab && <TabNotification />}
        </div>
      </div>
      <div
        ref={searchRef}
        className={`search-area fixed top-0 left-[80px] h-screen border-l-gray-300 bg-white z-20 overflow-y-auto transition-width duration-300 ease-in-out ${
          showSearchTab ? "w-[20%] border-x" : "w-0"
        }`}
      >
        <div className="h-full w-full">{showSearchTab && <TabSearch />}</div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
