import axios from "axios";
import { removeCart, setCart } from "../redux/cartSlice";
import { openModal } from "../redux/modalSlice";
import store from '../redux/store';
import { BASE_API } from "./ApplicationConstant";


const fetchCart = async () => {
    const cart = await getOrCreateCart();
    axios.get(`${BASE_API}/content/v1/cart/${cart.id}`, {
        headers: {
            user_token_query: cart.userTokenQuery
        }
    }).then(response => {
        store.dispatch(setCart(response.data))
    })
}

const submitCart = async (customerInfo, paymentMethod) => {
    const cart = await getOrCreateCart();
    const response = await axios.post(`${BASE_API}/content/v1/cart/${cart.id}/submit`,
        {
            customer_info: customerInfo,
            payment_method: paymentMethod
        },
        {
            headers: {
                user_token_query: cart.userTokenQuery
            }
        });
    return response.data;
}

const addToCart = async (productId) => {
    const cart = await getOrCreateCart();
    axios.post(`${BASE_API}/content/v1/cart/${cart.id}/items/${productId}`, null, {
        headers: {
            user_token_query: cart.userTokenQuery
        }
    }).then(response => {
        fetchCart()
        store.dispatch(openModal({
            title: null,
            text: 'Đã thêm sản phẩm vào giỏ hàng'
        }))
    }).catch(error => {
        console.log(error);
        clearCart();
    })
}

const removeFromCart = async (productId) => {
    const cart = await getOrCreateCart();

    axios.delete(`${BASE_API}/content/v1/cart/${cart.id}/items/${productId}`, {
        headers: {
            user_token_query: cart.userTokenQuery
        }
    }).then(response => {
        fetchCart()
    }).catch(error => {
        console.log(error);
        clearCart();
    })
}

const deleteCart = async () => {
    store.dispatch(removeCart())
    removeCartFromLocalStorage()
}

const getOrCreateCart = async () => {
    const state = store.getState();
    const cart = { ...state.cart.cart };

    if (cart.id == null) {
        const storageCart = getCartFromLocalStorage();
        if (storageCart != null) {
            try {
                const cart = await requestCart(storageCart.id, storageCart.userTokenQuery);
                return cart;
            } catch (error) {
                removeCartFromLocalStorage();
            }
        }
        const response = await axios.get(`${BASE_API}/content/v1/cart`);
        setCartFromLocalStorage(response.data);
        return response.data;
    }
    return cart;
}

const requestCart = async (id, token) => {
    const response = await axios.get(`${BASE_API}/content/v1/cart/${id}`, {
        headers: {
            user_token_query: token
        }
    });
    return response.data;
}

const clearCart = () => {
    store.dispatch(removeCart());
    removeCartFromLocalStorage();
}

const setCartFromLocalStorage = (cart) => {
    window.localStorage.setItem('cart', JSON.stringify(cart));
}

const getCartFromLocalStorage = () => {
    try {
        return JSON.parse(window.localStorage.getItem('cart'))
    } catch (error) {
        removeCartFromLocalStorage();
    }
    return null;
}

const removeCartFromLocalStorage = () => {
    window.localStorage.removeItem('cart');
}

export { submitCart, addToCart, removeFromCart, deleteCart, fetchCart }