import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findBrands = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/brands/`, { params });
    return response.data;
}

export const findBrand = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/brands/${id}`);
    return response.data;
}

export const saveBrand = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/brands`, data);
    return response.data;
}

export const deleteBrand = async (id) => {
    await axios.delete(`${BASE_API}/admin/v1/brands/${id}`);
}