import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findProducts = async (params) => {
    const response = await axios.get(`${BASE_API}/content/v1/products`, {
        params
    })
    return response;
}

const findProduct = async (id) => {
    const response = await axios.get(`${BASE_API}/content/v1/products/${id}`)
    return response;
}

export { findProducts, findProduct }