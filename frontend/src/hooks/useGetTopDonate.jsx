import { getTop5DonateAPI } from "@/apis/donate";
import { setTopDonate } from "@/redux/donateSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetTopDonate = () => {
  const dispatch = useDispatch();
  const fetchTopDonate = useCallback(async () => {
    try {
      const { data } = await getTop5DonateAPI();
      if (data.status === 200) {
        dispatch(setTopDonate(data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return { fetchTopDonate };
};

export default useGetTopDonate;
