import axios from "axios";
import { setDistricts } from "../redux/ghnDistrictSlice";
import { setProvinces } from "../redux/ghnProvinceSlice";
import { setWards } from "../redux/ghnWardSlice";
import store from '../redux/store';

const { BASE_API } = require("./ApplicationConstant");


export const fetchProvincesToStore = async () => {
    const response = await axios.get(`${BASE_API}/content/v1/delivery/provinces`);
    store.dispatch(setProvinces(response.data.data.reduce((obj, row) => {
        obj[row.ProvinceID] = {
            ProvinceID: row.ProvinceID,
            ProvinceName: row.ProvinceName
        };
        return obj
    }, {})))
}

export const fetchDistrictToStore = async (provinceId) => {
    const response = await axios.get(`${BASE_API}/content/v1/delivery/provinces/${provinceId}/districts`);
    store.dispatch(setDistricts(response.data.data.reduce((obj, row) => {
        obj[row.DistrictID] = {
            DistrictID: row.DistrictID,
            DistrictName: row.DistrictName
        };
        return obj
    }, {})))
}

export const fetchWardToStore = async (districtId) => {
    const response = await axios.get(`${BASE_API}/content/v1/delivery/districts/${districtId}/wards`);
    store.dispatch(setWards(response.data.data.reduce((obj, row) => {
        obj[row.WardCode] = {
            WardCode: row.WardCode,
            WardName: row.WardName
        };
        return obj
    }, {})))
}

export const clearWardFromStore = () => {
    store.dispatch(setWards([]))
}

export const clearDistrictFromStore = () => {
    store.dispatch(setDistricts([]))
}

export const getDeliveryInfo = async (orderId, districtId, wardCode) => {
    const response = await axios.get(`${BASE_API}/content/v1/delivery/${orderId}/calculate`, {
        params: {
            district_id: districtId,
            ward_code: wardCode
        }
    })
    return response.data;
}
