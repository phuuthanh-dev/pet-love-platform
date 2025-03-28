import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"
import axios from "axios"

export const sendMessageAPI = async (receiverId, textMessage) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/message/send/${receiverId}`, { textMessage })
}

export const sendImageMessageAPI = async (receiverId, imageFile, metadata = null) => {
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('image', imageFile)
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata))
  }
  return await axios.post(`${BASE_URL}/message/send-image/${receiverId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    },
  })
}

export const getAllMessageAPI = async (userId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/message/all/${userId}`)
}
