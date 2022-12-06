import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findMaterials = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/materials`, { params });
    return response.data;
}

export const createMaterial = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/materials`, data);
    return response.data;
}

export const updateMaterialStatus = async (id, status) => {
    const response = await axios.put(`${BASE_API}/admin/v1/materials/${id}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const updateMaterialName = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/materials/${id}/name`, data);
    return response.data;
}