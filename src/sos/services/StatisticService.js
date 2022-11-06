import axios from "axios"
import { BASE_API } from "./ApplicationConstant"

export const getOrderStatistic = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/statistics/orders`);
    return response.data;
}

export const getOrderChartStatisticData = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/statistics/order-chart-datas`);
    return response.data;
}