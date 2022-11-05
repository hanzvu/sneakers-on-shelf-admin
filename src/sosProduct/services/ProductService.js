import axios from "axios";
import { BASE_API } from "./ApplicationConstant";

const findProducts = async (params) => {
    const response = await axios.get(`${BASE_API}/content/v1/products`, {
        params
    })
    return response;
}

const findProduct = async (id) => {
    const response = await axios.get(`${BASE_API}/content/v1/products/${id}`)
    return response;
}

const deleteProductById = async (id) => {
    const response = await axios.delete(`${BASE_API}/content/v1/products/delete/${id}`)
    return response;
}

const addProduct = async (product) => {
    const response = await axios.get(`${BASE_API}/content/v1/products/save`, {
        product
    })
    return response;
} 

const updateProductById = async (product) => {
    return axios.post(`${BASE_API}/content/v1/products/update`,{
        method: "POST",
        headers: {
            Prefer: 'params=single-object',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
        },
        body: JSON.stringify(product),
    });
}

const getTemplateSaveListProduct = async () => {
    return axios.get(`${BASE_API}/content/v1/products/dowloadTeamplateFile`,{
        method: 'GET',
        responseType: 'blob',
    })
    .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data],{type: 'text/plain'}));
        console.log("res.data")
        console.log(res.data)
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'teamplate_insert_product_list.xlsx');
        document.body.appendChild(link)
    ;
        link.click();
    })
}

const paginationProduct = async(params) => {
    return axios.get(`${BASE_API}/content/v1/products/pages=${params}`)
};

const getAll = async() => {
    const response =  axios.get(`${BASE_API}/api/v1/products`)
    return response
};
    
export {getAll, findProducts, paginationProduct,findProduct,addProduct,deleteProductById ,updateProductById,getTemplateSaveListProduct}