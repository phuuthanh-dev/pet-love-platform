import { Button } from "antd";
import { Bone, Grid2x2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function StaffActions() {
  const { user } = useSelector((store) => store.auth);
  const userRole = user.role;
  return (
    <div className="my-5">
      <div className="border-y-2 py-6">
        <h3 className="block-minorHeader">Pet Love - Animal Care</h3>

        <div className="">
          <div className="flex flex-row sm:flex-row items-center gap-4 w-full">
            {userRole === "services_staff" ? (
              <>
                <Link to="/staff-services/managePet" rel="nofollow">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                    <Bone className="cursor-pointer text-white" size={18} />
                    <span className="button-text">Thêm bài đăng</span>
                  </Button>
                </Link>

                <Link to="/staff-services/manageAdoptionPost" rel="nofollow">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                    <Grid2x2 className="cursor-pointer text-white" size={18} />
                    <span className="button-text">Quản lý bài đăng</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/staff-forum/managePost" rel="nofollow">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                    <Bone className="cursor-pointer text-white" size={18} />
                    <span className="button-text">Quản lý bài đăng</span>
                  </Button>
                </Link>

                <Link to="/staff-forum/manageBlog" rel="nofollow">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                    <Grid2x2 className="cursor-pointer text-white" size={18} />
                    <span className="button-text">Quản lý Blog</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
