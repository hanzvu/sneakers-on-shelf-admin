import axios from "axios";
import { logoutAccount } from "./AccountService";
import { BASE_API } from "./ApplicationConstant";

export const addAuthenticationInterceptor = () => {
    axios.interceptors.request.use((config) => {
        const auth = getAuthenticatedUser();
        if (auth) {
            config.headers.Authorization = `${auth.type} ${auth.token}`;
        }
        return config;
    }, (error) => Promise.reject(error));

    const interceptor = axios.interceptors.response.use(
        response => response,
        async error => {
            axios.interceptors.response.eject(interceptor);
            const auth = getAuthenticatedUser();
            if (error.response && (error.response.status === 403 || error.response.status === 401) && auth != null) {
                return refreshToken(auth.refreshToken).then(response => {
                    error.response.config.headers.Authorization = `${response.data.type} ${response.data.token}`;
                    return axios(error.response.config);
                }).catch(error => {
                    if (error.response && (error.response.status === 403 || error.response.status === 401) ) {
                        removeAuthFromStorage()
                    }
                    return Promise.reject(error);
                }).finally(addAuthenticationInterceptor);
            }
            return Promise.reject(error);
        }
    );
}

export const login = async (account) => {
    const response = await axios.post(`${BASE_API}/api/v1/tokens/signin`, account);
    setAuthentication(response.data);
}

export const refreshToken = async (token) => {
    const response = await axios.post(`${BASE_API}/api/v1/tokens/refresh`, token, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    setAuthentication(response.data);
    return response;
}

export const setAuthentication = data => {
    localStorage.setItem("auth", JSON.stringify(data));
}

export const getAuthenticatedUser = () => JSON.parse(localStorage.getItem('auth'));

const removeAuthFromStorage = () => {
    localStorage.removeItem("auth");
}

export const logout = () => {
    removeAuthFromStorage();
    logoutAccount();
}

