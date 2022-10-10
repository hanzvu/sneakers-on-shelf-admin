import axios from "axios";
import { BASE_API } from "./ApplicationConstant";
import { ProductType } from "../Type/ProductType";

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

const addProduct = async (product) => {
    const response = await axios.get(`${BASE_API}/content/v1/products/save`, {
        product
    })
    return response;
} 

export { findProducts, findProduct,addProduct }