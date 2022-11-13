import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findCategories = async (params) => {
    return  axios.get(`${BASE_API}/admin/v1/categories`)
    
}
const findCategoryById = async (params) => {
    return  axios.get(`${BASE_API}/admin/v1/categories/${params}`)

}
export { findCategories,findCategoryById }