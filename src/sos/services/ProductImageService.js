import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const findProductImagesByProductId = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/products/${id}/product-images`);
    return response.data;
}

export const uploadProductImage = async (id, file) => {
    const data = new FormData();
    data.append("image", file);
    const response = await axios.post(`${BASE_API}/admin/v1/products/${id}/product-images`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
}

export const setDefaultProductImage = async (id) => {
    const response = await axios.put(`${BASE_API}/admin/v1/product-images/${id}/set-default`);
    return response;
}

export const deleteProductImage = async (id) => {
    const response = await axios.delete(`${BASE_API}/admin/v1/product-images/${id}`);
    return response;
}