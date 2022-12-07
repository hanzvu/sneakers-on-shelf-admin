import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findColors = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/colors`, { params });
    return response.data;
}

export const createColor = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/colors`, data);
    return response.data;
}

export const updateColorStatus = async (id, status) => {
    const response = await axios.put(`${BASE_API}/admin/v1/colors/${id}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const updateColor = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/colors/${id}`, data);
    return response.data;
}