import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findProducDetailByProductid = async (id) => {
    return axios.get(`${BASE_API}/admin/v1/productDetails/${id}`)
}
export {findProducDetailByProductid}