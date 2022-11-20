import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findVouchers = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/vouchers`, { params });
    return response.data;
}

export const submitVoucher = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/vouchers`, data);
    return response.data;
}

export const findAvailableVouchers = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/vouchers/available`, { params });
    return response.data;
}

export const invalidVoucher = async (id) => {
    await axios.delete(`${BASE_API}/admin/v1/vouchers/${id}`);
}