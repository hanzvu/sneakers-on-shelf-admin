import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findProducDetailByProductid = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/productDetails/findByProduct/${id}`,{
        headers: {
            'Access-Control-Allow-Origin':'*',
            "Access-Control-Allow-Headers": "X-Requested-With"
        },
    })
}

const findDetailBytid = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/productDetail/${id}`,{
        headers: {
            'Access-Control-Allow-Origin':'*',
        },
    })
}
const deleteDetailById = async (id) => {
    return axios.post(`${BASE_API}/admin/v1/productDetail/delete/${id}`,{
        headers: {
            'Access-Control-Allow-Origin':'*',
        },
    })
}

const updateQuantityById = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/productDetail/update`,{
        headers: {
            'Access-Control-Allow-Origin':'*',
        },
    })
}


export {findProducDetailByProductid,findDetailBytid,updateQuantityById,deleteDetailById}