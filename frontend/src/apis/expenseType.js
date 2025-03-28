import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const getExpenseTypes = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/expense-type`);
};
