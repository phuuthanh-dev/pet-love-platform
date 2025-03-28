import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const getAllNotificationAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/notification/all`)
}
