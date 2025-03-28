/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { handleLogoutAPI } from "@/apis/auth";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.log("logout at line 18 ProtectedRoutes");

      navigate("/login");
      logoutHandler();
      return;
    }
    const decoded = jwtDecode(accessToken);

    if (
      user &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(decoded.role)
    ) {
      toast.error("You are not authorized to access this page");
      navigate("/");
    }
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await handleLogoutAPI();
      if (res.status === 200) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
        toast.error('Vui lòng đăng nhập!');
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return user ? children : null;
};

export default ProtectedRoutes;
