import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const getPageStaff = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/staff`, { params });
    return response.data;
}

export const createStaff = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/staff`, data);
    return response.data;
}

export const getStaffAccountDTOById = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/staff/${id}`);
    const rs = response.data;
    rs.customerInfos = rs.customerInfos.reduce((obj, row) => {
        obj[row.id] = row;
        return obj
    }, {});
    return rs;
}

export const updateStaffInfo = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/staff/${id}/info`, data);
    return response;
}

export const getImportStaffTemplateFile = async () => {
    const response = await axios.get(`${BASE_API}/admin/v1/staff/import-template`);
    return response;
}

export const uploadStaffFile = async (file) => {
    const data = new FormData();
    data.append("data", file);
    const response = await axios.post(`${BASE_API}/api/v1/templates/staff/import-template`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
}