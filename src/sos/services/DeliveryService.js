import axios from "axios";
import { setDistricts } from "../redux/ghnDistrictSlice";
import { setProvinces } from "../redux/ghnProvinceSlice";
import { setWards } from "../redux/ghnWardSlice";
import store from '../redux/store';

const { BASE_API } = require("./ApplicationConstant");


const fetchProvincesToStore = () => {
    axios.get(`${BASE_API}/content/v1/delivery/provinces`).then(response => {
        store.dispatch(setProvinces(response.data.data.reduce((obj, row) => {
            obj[row.ProvinceID] = {
                ProvinceID: row.ProvinceID,
                ProvinceName: row.ProvinceName
            };
            return obj
        }, {})))
    });
}

const fetchDistrictToStore = provinceId => {
    axios.get(`${BASE_API}/content/v1/delivery/provinces/${provinceId}/districts`).then(response => {
        store.dispatch(setDistricts(response.data.data.reduce((obj, row) => {
            obj[row.DistrictID] = {
                DistrictID: row.DistrictID,
                DistrictName: row.DistrictName
            };
            return obj
        }, {})))
    })
}

const fetchWardToStore = districtId => {
    axios.get(`${BASE_API}/content/v1/delivery/districts/${districtId}/wards`).then(response => {
        store.dispatch(setWards(response.data.data.reduce((obj, row) => {
            obj[row.WardCode] = {
                WardCode: row.WardCode,
                WardName: row.WardName
            };
            return obj
        }, {})))
    })
}

const clearWardFromStore = () => {
    store.dispatch(setWards([]))
}

const getDeliveryInfo = async (orderId, districtId, wardCode) => {
    const response = await axios.get(`${BASE_API}/content/v1/delivery/${orderId}/calculate`, {
        params: {
            district_id: districtId,
            ward_code: wardCode
        }
    })
    return response.data;
}

export { fetchProvincesToStore, fetchDistrictToStore, fetchWardToStore, getDeliveryInfo, clearWardFromStore }