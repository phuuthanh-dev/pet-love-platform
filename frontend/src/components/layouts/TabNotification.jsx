import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import VerifiedBadge from "../core/VerifiedBadge";
import { Link, useLocation } from "react-router-dom";
import { setShowNotificationTab } from "@/redux/sidebarSlice";
import useGetAllNotification from "@/hooks/useGetAllNotification";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";

const TabNotification = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useGetAllNotification();
  useGetSuggestedUsers(30);
  const { notifications } = useSelector((store) => store.realTimeNotification);
  const { suggestedUsers } = useSelector((store) => store.auth);
  const clientSetting = useSelector((state) => state.setting.clientSetting);
  const logo = clientSetting?.find((item) => item.name === "Logo")?.value;

  const groupNotificationsByDate = (notifications) => {
    if (!Array.isArray(notifications)) {
      console.warn("notifications is not an array:", notifications);
      return [];
    }
    return Object.entries(
      notifications?.reduce((acc, notification) => {
        const date = new Date(notification.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        let dateString;

        if (date.toDateString() === today.toDateString()) {
          dateString = "Hôm nay";
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateString = "Hôm qua";
        } else {
          dateString = date.toLocaleDateString(); // Ngày/Tháng/Năm
        }

        if (!acc[dateString]) {
          acc[dateString] = []; // Khởi tạo mảng cho ngày mới
        }
        acc[dateString].push(notification); // Thêm thông báo vào ngày tương ứng
        return acc;
      }, {})
    )
      .sort((a, b) => {
        const order = ["Hôm nay", "Hôm qua", "25/1", "24/1", "22/1"];
        const dateA =
          a[0] === "Hôm nay"
            ? 0
            : a[0] === "Hôm qua"
            ? 1
            : new Date(a[0]).getTime();
        const dateB =
          b[0] === "Hôm nay"
            ? 0
            : b[0] === "Hôm qua"
            ? 1
            : new Date(b[0]).getTime();

        // Sắp xếp theo thứ tự đã định trước
        const orderA = order.indexOf(a[0]);
        const orderB = order.indexOf(b[0]);

        return orderA - orderB || dateB - dateA; // Sắp xếp theo thứ tự đã định trước và sau đó theo ngày
      })
      .reverse();
  };

  // ... existing code ...

  // Usage example
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <>
      <h1 className="font-bold my-5 pl-[20px]" style={{ fontSize: "24px" }}>
        Thông báo
      </h1>
      {notifications?.length === 0 && (
        <>
          <div style={{ borderRadius: "4px" }}>
            <div
              style={{
                alignItems: "stretch",
                border: "0",
                boxSizing: "border-box",
                display: "block",
                flexDirection: "column",
                flexShrink: "0",
                font: "inherit",
                fontSize: "100%",
                margin: "0",
                padding: "0",
                position: "relative",
                verticalAlign: "baseline",
              }}
            >
              <div className="px-8 d-flex flex-column align-items-center justify-items-center">
                <div>
                  <svg
                    aria-label="Hoạt động trên bài viết của bạn"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="62"
                    role="img"
                    viewBox="0 0 96 96"
                    width="62"
                  >
                    <title>Hoạt động trên bài viết của bạn</title>
                    <circle
                      cx="48"
                      cy="48"
                      fill="none"
                      r="47"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></circle>
                    <path
                      d="M48 34.4A13.185 13.185 0 0 0 37.473 29a12.717 12.717 0 0 0-6.72 1.939c-6.46 3.995-8.669 12.844-4.942 19.766 3.037 5.642 16.115 15.6 20.813 19.07a2.312 2.312 0 0 0 2.75 0c4.7-3.47 17.778-13.428 20.815-19.07 3.728-6.922 1.517-15.771-4.943-19.766A12.704 12.704 0 0 0 58.527 29 13.193 13.193 0 0 0 48 34.4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <div className="mt-2">
                  <span style={{ textAlign: "center", fontSize: "14px" }}>
                    Hoạt động trên bài viết của bạn
                  </span>
                </div>
                <div className="mt-2 mb-8 flex">
                  <span style={{ textAlign: "center", fontSize: "14px" }}>
                    Khi có người thích hoặc bình luận về một trong những bài
                    viết của bạn, bạn sẽ nhìn thấy nó ở đây.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-[20px] flex items-center justify-between mb-4 pr-4">
            <span className="text-md font-bold">Gợi ý cho bạn</span>
          </div>
          <div className="overflow-y-auto h-[80vh]">
            {suggestedUsers?.map((suggestedUser) => (
              <Link
                key={suggestedUser?.id}
                to={`/profile/${suggestedUser?.username}`}
                onClick={() => {
                  dispatch(setShowNotificationTab(false));
                }}
              >
                <div
                  key={suggestedUser.id}
                  className="pl-[20px] flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-50"
                >
                  <div className="relative">
                    <Avatar
                      className="w-14 h-14"
                      style={{ border: "1px solid #e0e0e0" }}
                    >
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback>
                        <img
                          src={logo}
                          alt="PetPals"
                          className="object-contain h-full w-full"
                        />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {suggestedUser?.username}
                      </span>
                      {suggestedUser.isVerified && <VerifiedBadge size={14} />}
                    </span>
                    <span className="text-xs text-gray-500">
                      {suggestedUser.firstName && suggestedUser.lastName
                        ? `${suggestedUser?.lastName} ${suggestedUser?.firstName}`
                        : "Gợi ý cho bạn"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {/* {calculateTimeAgo(notification.createdAt)} */}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {notifications?.length > 0 && (
        <>
          {groupedNotifications.map(([date, notificationsForDate]) => (
            <div key={date}>
              <div className="pl-[20px] flex items-center justify-between pr-4 my-2">
                <span className="text-md font-bold">{date}</span>
              </div>
              <div className="overflow-y-auto">
                {notificationsForDate.map((notification, index) => {
                  const isCurrentPost =
                    location.pathname === `/p/${notification?.post?._id}`;

                  return (
                    <div key={index}>
                      {/* Nếu thông báo không liên quan đến post (post === null) */}
                      {!notification?.post ? (
                        <div className="pl-[20px] flex gap-3 justify-between items-center cursor-default py-2">
                          <div className="flex gap-3">
                            <Avatar
                              className="w-12 h-12"
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              <AvatarImage
                                src={notification?.sender?.profilePicture}
                              />
                              <AvatarFallback>
                                <img
                                  src={logo}
                                  alt="PetPals"
                                  className="object-contain h-full w-full"
                                />
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              <div className="inline-flex mr-1 font-semibold inline-flex items-center gap-1">
                                {notification?.sender?.username}
                                {notification?.sender?.isVerified && (
                                  <VerifiedBadge size={14} />
                                )}
                              </div>
                              <span className="text-sm whitespace-normal break-all overflow-wrap-anywhere max-w-full">
                                {notification?.message}.
                              </span>
                              <span className="text-xs text-gray-400 block">
                                {calculateTimeAgo(notification.createdAt)}
                              </span>
                            </span>
                          </div>
                        </div>
                      ) : isCurrentPost ? (
                        // Nếu post đã được mở, hiển thị nhưng không cho click
                        <div className="pl-[20px] flex gap-3 justify-between items-center cursor-default py-2">
                          <div className="flex gap-3">
                            <Avatar
                              className="w-12 h-12"
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              <AvatarImage
                                src={notification?.sender?.profilePicture}
                              />
                              <AvatarFallback>
                                <img
                                  src={logo}
                                  alt="PetPals"
                                  className="object-contain h-full w-full"
                                />
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              <div className="inline-flex mr-1 font-semibold inline-flex items-center gap-1">
                                {notification?.sender?.username}
                                {notification?.sender?.isVerified && (
                                  <VerifiedBadge size={14} />
                                )}
                              </div>
                              <span className="text-sm whitespace-normal break-all overflow-wrap-anywhere max-w-full">
                                {notification?.message}.
                              </span>
                              <span className="text-xs text-gray-400 block">
                                {calculateTimeAgo(notification.createdAt)}
                              </span>
                            </span>
                          </div>
                          <span>
                            <img
                              className="h-[44px] w-[44px] object-cover rounded-xl"
                              src={notification?.post?.image}
                            />
                          </span>
                        </div>
                      ) : (
                        // Nếu post chưa mở, cho phép click vào
                        <Link
                          to={`/p/${notification?.post?._id}`}
                          onClick={() =>
                            dispatch(setShowNotificationTab(false))
                          }
                          className="pl-[20px] flex gap-3 justify-between items-center cursor-pointer py-2 hover:bg-gray-50"
                        >
                          <div className="flex gap-3">
                            <Avatar
                              className="w-12 h-12"
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              <AvatarImage
                                src={notification?.sender?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              <div className="inline-flex mr-1 font-semibold inline-flex items-center gap-1">
                                {notification?.sender?.username}
                                {notification?.sender?.isVerified && (
                                  <VerifiedBadge size={14} />
                                )}
                              </div>
                              <span className="text-sm whitespace-normal break-all overflow-wrap-anywhere max-w-full">
                                {notification?.message}.
                              </span>
                              <span className="text-xs text-gray-400 block">
                                {calculateTimeAgo(notification.createdAt)}
                              </span>
                            </span>
                          </div>
                          <span>
                            <img
                              className="h-[44px] w-[44px] object-cover rounded-xl"
                              src={notification?.post?.image}
                            />
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default TabNotification;
