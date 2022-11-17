import axios from "axios"
import { clearAccount, setAccount } from "../redux/accountSlice";
import store from '../redux/store';
import { BASE_API } from "./ApplicationConstant"
import { getAuthenticatedUser } from "./AuthenticationService";

export const fetchAccount = async () => {
    const auth = getAuthenticatedUser()
    if (auth != null) {
        const response = await axios.get(`${BASE_API}/api/v1/accounts/${auth.id}`);
        store.dispatch(setAccount(response.data));
    }
}

export const getAddresses = async (id) => {
    const response = await axios.get(`${BASE_API}/api/v1/accounts/${id}/customer-infos`);
    return response.data;
}

export const createAddress = async (data) => {
    const response = await axios.post(`${BASE_API}/api/v1/customer-infos`, data);
    return response.data;
}

export const setDefaultAddress = async (id) => {
    const response = await axios.put(`${BASE_API}/api/v1/customer-infos/${id}/set-default`);
    return response.data;
}

export const deactiveAddress = async (id) => {
    const response = await axios.put(`${BASE_API}/api/v1/customer-infos/${id}/deactive`);
    return response.data;
}

export const logoutAccount = () => {
    store.dispatch(clearAccount())
}

export const getAccountDTOs = async (params) => {
    const response = await axios.get(`${BASE_API}/admin/v1/accounts`, { params });
    return response.data;
}

export const getAccountDTOById = async (id) => {
    const response = await axios.get(`${BASE_API}/admin/v1/accounts/${id}`);
    const rs = response.data;
    rs.customerInfos = rs.customerInfos.reduce((obj, row) => {
        obj[row.id] = row;
        return obj
    }, {});
    return rs;
}