import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findBrands = async () => {
    return axios.get(`${BASE_API}/api/v1/brands`)
}
const findBrandById = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/brands/${id}`)
}
export { findBrands,findBrandById }