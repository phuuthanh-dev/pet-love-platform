import { fetchCampaignAPI } from "@/apis/campaign";
import { setCampaigns } from "@/redux/campaignSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetCampaign = () => {
  const dispatch = useDispatch();
  const fetchCampaigns = useCallback(async () => {
    try {
      const { data } = await fetchCampaignAPI();
      if (data.status === 200) {
        dispatch(setCampaigns(data.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return { fetchCampaigns };
};

export default useGetCampaign;
