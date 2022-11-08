import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findBrands = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/brands`, {
        params
    })
    return response;
}
export { findBrands }