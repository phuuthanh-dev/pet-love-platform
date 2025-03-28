import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import VerifiedBadge from "../core/VerifiedBadge";
import ProcessDonate from "../features/donate/ProcessDonate";
import TopDonate from "../features/donate/TopDonate";
import SuggestedUsers from "../features/users/SuggestedUsers";
import StaffActions from "./StaffActions";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const userRole = user?.role ? user.role : "user";
  const { campaigns } = useSelector((store) => store.campaign);
  const { topDonate } = useSelector((store) => store.donate);

  return (
    <div className="my-10 pr-6">
      {user && (
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user?.username}`}>
            <Avatar style={{ border: "1px solid #e0e0e0" }}>
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
              {user?.bio || "Bio here..."}
            </span>
          </div>
        </div>
      )}
      {!["services_staff", "forum_staff"].includes(userRole) &&
        campaigns?.length > 0 && (
          <>
            {campaigns.map((campaign) => (
              <ProcessDonate key={campaign._id} campaign={campaign} />
            ))}
            <div className="mt-4">
              <Link to="/campaigns">
                <Button variant="outline" className="w-full">
                  Xem tất cả chiến dịch hiện tại{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      {["services_staff", "forum_staff"].includes(userRole) && <StaffActions />}
      {user && topDonate.length > 0 && <TopDonate topDonate={topDonate} />}
      {user && <SuggestedUsers />}
    </div>
  );
};

export default RightSidebar;
