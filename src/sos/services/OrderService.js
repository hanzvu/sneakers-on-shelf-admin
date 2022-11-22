import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const getAllOrder = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/orders`, {
        params
    });
    return response.data;
}

export const getOrderById = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/orders/${id}`);
    return response.data;
}

export const updateOrderStatus = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/orders/${id}/order-status`, data);
    return response;
}

export const updateOrderAddress = async (id, value) => {
    const response = await axios.put(`${BASE_API}/admin/v1/orders/${id}/order-address`, value);
    return response;
}

export const updateOrderItemQuantity = async (id, data) => {
    const response = await axios.put(`${BASE_API}/admin/v1/order-items/${id}`, data);
    return response;
}

export const deleteOrderItem = async (id, params) => {
    const response = await axios.delete(`${BASE_API}/admin/v1/order-items/${id}`, { params });
    return response;
}

export const addOrderItem = async (id, data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/orders/${id}/order-items`, data);
    return response;
}