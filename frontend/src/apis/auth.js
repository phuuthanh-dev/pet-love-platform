import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { BASE_URL } from '@/configs/globalVariables'

export const signupAPI = async (data) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/auth/register`, data)
}

export const handleLogoutAPI = async () => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/auth/logout`)
}

export const refreshTokenAPI = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  return await authorizedAxiosInstance.post(`${BASE_URL}/auth/refresh-token`, { refresh_token })
}

export const loginAPI = async (data) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/auth/login`, data)
}

