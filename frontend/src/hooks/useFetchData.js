import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetCampaign from "@/hooks/useGetCampaign";
import useGetTopDonate from "@/hooks/useGetTopDonate";
import useGetAllAdoptPost from "./useGetAllAdoptPost";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useFetchData = () => {
  const { user } = useSelector((store) => store.auth);
  const { fetchAllPost } = useGetAllPost();
  const { fetchAdoptPosts } = useGetAllAdoptPost();
  const { fetchSuggestedUsers } = useGetSuggestedUsers(5);
  const { fetchCampaigns } = useGetCampaign();
  const { fetchTopDonate } = useGetTopDonate();

  useEffect(() => {
    if (!user) {
      fetchAllPost();
      fetchAdoptPosts();
      fetchCampaigns();
      return;
    }
    fetchSuggestedUsers();
    fetchTopDonate();
  }, [
    fetchAllPost,
    fetchAdoptPosts,
    fetchSuggestedUsers,
    fetchCampaigns,
    fetchTopDonate,
    user
  ]);
};

export default useFetchData;
