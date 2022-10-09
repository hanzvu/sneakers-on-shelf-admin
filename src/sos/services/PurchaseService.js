import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const getPurchase = async (id, userTokenQuery) => {
    const response = await axios.get(`${BASE_API}/content/v1/purchase/${id}`, {
        headers: {
            user_token_query: userTokenQuery
        }
    });
    return response.data;
}

export { getPurchase }