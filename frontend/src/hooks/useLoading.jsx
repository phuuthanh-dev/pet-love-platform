import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/loadingSlice";

const useLoading = () => {
  const dispatch = useDispatch();

  const showLoading = () => dispatch(setLoading(true));
  const hideLoading = () => dispatch(setLoading(false));

  return { showLoading, hideLoading };
};

export default useLoading; 