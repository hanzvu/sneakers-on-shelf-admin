import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findCategories = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/categories`, { params });
    return response.data;
}

export const findCategory = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/categories/${id}`);
    return response.data;
}

export const saveCategory = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/categories`, data);
    return response.data;
}

export const deleteCategory = async (id) => {
    await axios.delete(`${BASE_API}/admin/v1/categories/${id}`);
}