/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfileByIdAPI } from "@/apis/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedBadge from "@/components/core/VerifiedBadge";

const UserListItem = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getProfileByIdAPI(userId)
        
        if (data.status === 200) {
          setUserData(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userData) return null;
  const handleClick = () => {
    onClose(); // Close the modal before navigation
  };
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10" style={{ border: "1px solid #e0e0e0" }}>
          <AvatarImage src={userData.profilePicture} alt={userData.username} />
          <AvatarFallback>{userData.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link
            to={`/profile/${userData.username}`}
            className="font-semibold text-sm hover:underline flex items-center gap-1"
            onClick={handleClick}
          >
            {userData.username}
            {userData?.isVerified && <VerifiedBadge size={14} />}
          </Link>
          <span className="text-gray-500 text-xs">
            {userData.bio?.slice(0, 30)}
          </span>
        </div>
      </div>
      {/* Add follow/unfollow button here if needed */}
    </div>
  );
};

export default UserListItem;
