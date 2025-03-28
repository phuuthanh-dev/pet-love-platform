import authorizedAxiosInstance from "@/utils/authorizedAxios"
import { BASE_URL } from "@/configs/globalVariables"

export const addCommentAPI = async (postId, text) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/post/${postId}/comment`, { text })
}