import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findBrands = async (params) => {
    const response = await axios.get(`${BASE_API}/api/v1/brands`, {
        params
    })
    return response;
}
export { findBrands }