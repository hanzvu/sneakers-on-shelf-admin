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


export const updateDeliveryStatus = async (id, value) => {
    const response = await axios.put(`${BASE_API}/admin/v1/deliveries/${id}/delivery-status`, value,
        { headers: { "Content-Type": "application/json" } });
    return response;
}


export const updatePaymentStatus = async (id, value) => {
    const response = await axios.put(`${BASE_API}/admin/v1/orders/${id}/payment-status`, value,
        { headers: { "Content-Type": "application/json" } });
    return response;
}