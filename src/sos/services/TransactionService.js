import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const createTransaction = async (data) => {
    await axios.post(`${BASE_API}/admin/v1/transactions`, data);
}

export const findTransactions = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/transactions`, { params });
    return response.data;
}