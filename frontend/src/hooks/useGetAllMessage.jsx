import { getAllMessageAPI } from "@/apis/message";
import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        if (selectedUser?.id && selectedUser.id !== "ai-support") {
          console.log("Fetching messages for userId:", selectedUser?.id);
          const { data } = await getAllMessageAPI(selectedUser?.id);
          console.log("Messages data:", data);

          if (data.status === 200) {
            dispatch(setMessages(data.data));
          }
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };
    fetchAllMessage();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessage;