import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

export const getAllCart = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/carts`, { params });
    return response.data;
}

export const createCart = async () => {
    const response = await axios.post(`${BASE_API}/admin/v1/carts`);
    return response.data;
}

export const getCartById = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/carts/${id}`);
    return response.data;
}

export const cancelCartById = async (id) => {
    await axios.delete(`${BASE_API}/admin/v1/carts/${id}`);
}

export const addToCart = async (cartId, productId, quantity = 1) => {
    await axios.post(`${BASE_API}/admin/v1/carts/${cartId}/items`, null, {
        params: {
            product_detail_id: productId,
            quantity
        }
    });
}

export const removeFromCart = async (id) => {
    await axios.delete(`${BASE_API}/admin/v1/carts/items/${id}`);
}

export const setCartItemQuantity = async (id, quantity) => {
    await axios.put(`${BASE_API}/api/v1/cart/items/${id}`, null, {
        params: {
            quantity
        }
    })
}

export const submitCart = async (id, data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/carts/${id}/submit`, data);
    return response.data;
}