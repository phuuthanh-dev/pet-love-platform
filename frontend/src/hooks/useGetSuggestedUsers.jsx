import { suggestedAPI } from "@/apis/user";
import { setSuggestedUsers } from "@/redux/authSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = (limit) => {
  const dispatch = useDispatch();
  const fetchSuggestedUsers = useCallback(async () => {
    try {
      const { data } = await suggestedAPI(limit);

      if (data.status === 200) {
        dispatch(setSuggestedUsers(data.data.results));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, limit]);

  return { fetchSuggestedUsers };
};
export default useGetSuggestedUsers;
