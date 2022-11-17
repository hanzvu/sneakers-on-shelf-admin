import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

export const findProducts = async (params) => {
    const response = await axios.get(`${BASE_API}/content/v1/products`, {
        params
    })
    return response.data;
}

export const findProduct = async (id) => {
    const response = await axios.get(`${BASE_API}/content/v1/products/${id}`)
    return response.data;
}
