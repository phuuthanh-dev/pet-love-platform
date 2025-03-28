import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { BASE_URL } from '@/configs/globalVariables'

export const createBlogAPI = async (formData) => {
    return await authorizedAxiosInstance.post(
        `${BASE_URL}/blog/create`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
}

export const getAllBlogsAPI = async (params) => {
    return await authorizedAxiosInstance.get(`${BASE_URL}/blog/all`, { params })
}

export const getBlogByIdAPI = async (id) => {
    return await authorizedAxiosInstance.get(`${BASE_URL}/blog/${id}`)
}

export const updateBlogAPI = async (id, formData) => {
    return await authorizedAxiosInstance.put(
        `${BASE_URL}/blog/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
}

export const deleteBlogAPI = async (id) => {
    return await authorizedAxiosInstance.delete(`${BASE_URL}/blog/${id}`)
}

export const likeBlogAPI = async (id) => {
    return await authorizedAxiosInstance.put(`${BASE_URL}/blog/${id}/like`)
}

export const dislikeBlogAPI = async (id) => {
    return await authorizedAxiosInstance.put(`${BASE_URL}/blog/${id}/dislike`)
}

export const commentBlogAPI = async (id, text) => {
    return await authorizedAxiosInstance.post(`${BASE_URL}/blog/${id}/comment`, { text })
}

export const getCommentsAPI = async (id) => {
    return await authorizedAxiosInstance.get(`${BASE_URL}/blog/${id}/comments`)
} 