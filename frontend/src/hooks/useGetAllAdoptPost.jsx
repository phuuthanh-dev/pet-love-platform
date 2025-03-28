import { fetchAllAdoptionPostsAPI } from "@/apis/post";
import { setAdoptPostPage, setAdoptPosts } from "@/redux/adoptPostSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdoptPost = () => {
  const dispatch = useDispatch();
  const fetchAdoptPosts = useCallback(async () => {
    try {
      const { data } = await fetchAllAdoptionPostsAPI(1);
      if (data.status === 200) {
        dispatch(setAdoptPosts(data.data.results));
        dispatch(setAdoptPostPage(1));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return { fetchAdoptPosts };
};
export default useGetAllAdoptPost;
