import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findSoles = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/soles`, { params });
    return response.data;
}

export const createSole = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/soles`, data);
    return response.data;
}

export const updateSoleStatus = async (id, status) => {
    const response = await axios.put(`${BASE_API}/admin/v1/soles/${id}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const updateSoleName = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/soles/${id}/name`, data);
    return response.data;
}