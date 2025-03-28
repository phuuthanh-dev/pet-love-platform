import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const getStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${BASE_URL}/admin/stats`);
  return response;
};

export const getAllStaffAPI = async (page = 1, limit = 5, q = "") => {
  const response = await authorizedAxiosInstance.get(
    `${BASE_URL}/admin/staff?q=${encodeURIComponent(
      q
    )}&limit=${limit}&page=${page}`
  );
  return response;
};

export const getAllDonationsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${BASE_URL}/donation`);
  return response;
};

export const createStaffAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${BASE_URL}/admin/staff`,
    data
  );
  return response;
};
