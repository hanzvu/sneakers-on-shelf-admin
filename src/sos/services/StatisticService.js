import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const getOrderStatistic = async () => {
    const response = await axios.get(`${BASE_API}/admin/v1/statistics/orders`);
    return response.data;
}

export const getOrderChartStatisticData = async (data) => {
    const response = await axios.post(`${BASE_API}/admin/v1/statistics/order-chart-datas`, data);
    return response.data;
}

export const getBestSellingProductStatistic = async () => {
    const response = await axios.get(`${BASE_API}/admin/v1/statistics/best-selling-product`);
    return response.data;
}

export const getOrderStatusStatisticProjections = async () => {
    const response = await axios.get(`${BASE_API}/admin/v1/statistics/order-status`);
    return response.data;
}