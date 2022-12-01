import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

export const createProductDetail = async (id, data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/products/${id}/product-details`, data);
    return response;
}

export const changeProductDetailStatus = async (id, status) => {
    const response = await axios.put(`${BASE_API}/admin/v1/product-details/${id}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export const changeProductDetailQuantity = async (id, quantity) => {
    const response = await axios.put(`${BASE_API}/admin/v1/product-details/${id}/quantity`, quantity, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

