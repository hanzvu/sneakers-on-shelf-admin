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

export const getAllColor = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/colors`);
    return response.data.content;
}

export const getAllSole = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/soles`);
    return response.data.content;
}

export const getAllMaterial = async () => {
    const response = await axios.get(`${BASE_API}/api/v1/materials`);
    return response.data.content;
}
