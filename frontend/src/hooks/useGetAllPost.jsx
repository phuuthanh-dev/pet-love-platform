import { fetchAllPostsAPI } from "@/apis/post";
import { setPosts } from "@/redux/postSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const fetchAllPost = useCallback(async () => {
    try {
      const isApproved = true;
      const { data } = await fetchAllPostsAPI(1,4, isApproved);
      if (data.status === 200) {
        dispatch(setPosts(data.data.results));
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, [dispatch]);

  return { fetchAllPost };
};
export default useGetAllPost;
