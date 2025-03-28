import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { followOrUnfollowAPI } from "@/apis/user";
import { toast } from "sonner";
import { setSuggestedUsers } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedBadge from "@/components/core/VerifiedBadge";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const handleFollow = async (userId) => {
    const { data } = await followOrUnfollowAPI(userId);

    if (data.status === 200) {
      dispatch(setSuggestedUsers(suggestedUsers.filter((user) => user.id !== userId)));
      toast.success(data.message);
    }
  }
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm mb-5">
        <h1 className="font-bold text-gray-600">Gợi ý cho bạn</h1>
        <span className="font-semibold cursor-pointer">Xem tất cả</span>
      </div>
      {suggestedUsers.slice(0, 5).map((user) => {
        return (
          <div
            key={user.id}
            className="flex items-center justify-between p-2"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?.username}`}>
                <Avatar style={{border: "1px solid #e0e0e0"}}>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm flex items-center gap-2">
                  <Link to={`/profile/${user?.username}`}>{user?.username}</Link>
                  {user?.isVerified && <VerifiedBadge size={14} />}
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Gợi ý cho bạn"}
                </span>
              </div>
            </div>
            <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]" onClick={() => handleFollow(user.id)}>
              Theo dõi
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
