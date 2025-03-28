import { setUserProfile } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfileAPI } from "@/apis/user";

const useGetUserProfile = (username) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await getProfileAPI(username);

        if (data.status === 200) {  
          
          dispatch(setUserProfile(data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (username) {
      fetchUserProfile();
    }
  }, [username, dispatch]);
};
export default useGetUserProfile;
