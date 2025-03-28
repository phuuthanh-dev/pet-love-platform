import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const getExpenses = async (page, limit) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/expense?page=${page}&limit=${limit}`)
};

export const createExpense = async (expenseData) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/expense`, expenseData);
}

export const uploadExpenseReceipt = async (expenseId, receipt) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/expense/${expenseId}/upload`, receipt, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export const approveExpense = async (expenseId, status) => {
  return await authorizedAxiosInstance.put(`${BASE_URL}/expense/${expenseId}/approve`, { status });
}

export const verifyExpense = async (expenseId, status) => {
  return await authorizedAxiosInstance.put(`${BASE_URL}/expense/${expenseId}/verify`, { status });
}

export const deleteExpense = async (expenseId) => {
  return await authorizedAxiosInstance.delete(`${BASE_URL}/expense/${expenseId}`);
}