import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";
import { useState } from "react";
import { getAllUsersAPI } from "@/apis/user";
import VerifiedBadge from "../core/VerifiedBadge";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShowSearchTab } from "@/redux/sidebarSlice";

const TabSearch = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  const handleSearch = async (query) => {
    if (query) {
      try {
        const { data } = await getAllUsersAPI(query);
        setSearchUsers(data.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        console.log(error);
      }
    } else {
      setSearchUsers([]);
    }
  };
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <>
      <h1 className="font-semibold my-8 pl-[20px]" style={{ fontSize: "24px"}}>Tìm kiếm</h1>
      <div className="pl-[20px] pr-[20px] mb-6">
        <div className="relative">
          <input
            type="text"
            onChange={handleInputChange}
            value={searchQuery}
            placeholder="Tìm kiếm..."
            className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 px-4 pl-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 15l5.5 5.5M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>
      {searchUsers.length > 0 && (
        <>
          <div className="pl-[20px] flex items-center justify-between mb-4 pr-4 border-t"></div>
          <div className="overflow-y-auto h-[80vh]">
            {searchUsers?.map((searchUser) => (
              <Link
                key={searchUser?.id}
                to={`/profile/${searchUser?.username}`}
                onClick={() => {
                  dispatch(setShowSearchTab(false));
                }}
              >
                <div className="pl-[20px] flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-50">
                  <div className="relative">
                    <Avatar
                      className="w-14 h-14"
                      style={{ border: "1px solid #e0e0e0" }}
                    >
                      <AvatarImage src={searchUser?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {searchUser?.username}
                      </span>
                      {searchUser.isVerified && <VerifiedBadge size={14} />}
                    </span>
                    <span className="text-xs text-gray-500">
                      {searchUser?.lastName} {searchUser?.firstName}
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
      {searchQuery !== "" && searchUsers.length === 0 && (
        <div className="flex justify-center items-center h-[70%]">
          Không tìm thấy kết quả nào.
        </div>
      )}
    </>
  );
};

export default TabSearch;
