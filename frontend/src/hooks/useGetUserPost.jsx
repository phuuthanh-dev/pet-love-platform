import { fetchAllPostsAPI } from "@/apis/post";
import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const { data } = await fetchAllPostsAPI();

        if (data.status === 200) {
          dispatch(setPosts(data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};
export default useGetUserPost;
