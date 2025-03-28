import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import axios from "axios";

export const getClientSettingAPI = async () => {
  const response = await axios.get(`${BASE_URL}/client-setting`);
  return response;
};

export const updateClientSettingAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(
    `${BASE_URL}/client-setting/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const createClientSettingAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${BASE_URL}/client-setting`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
