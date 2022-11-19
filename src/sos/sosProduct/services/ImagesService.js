import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findProducImageByProductid = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/images/findByProductId/${id}`)
}

const findById = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/images/${id}`)
}

const deleteById = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/images/delete/${id}`)
}
export {findProducImageByProductid,deleteById,findById}