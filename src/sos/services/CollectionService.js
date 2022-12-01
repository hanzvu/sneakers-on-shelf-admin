import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

export const getAllCategory = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/categories`);
    return response.data;
}

export const getAllBrand = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/brands`);
    return response.data;
}

export const getAllProductGender = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/product-genders`);
    return response.data;
}