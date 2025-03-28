import { getAllNotificationAPI } from "@/apis/notification";
import { setNotifications } from "@/redux/rtnSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllNotification = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllNotification = async () => {
      try {
        const { data } = await getAllNotificationAPI();
        
        if (data.status === 200) {
          dispatch(setNotifications(data.data.results));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllNotification();
  }, []);
};
export default useGetAllNotification;
