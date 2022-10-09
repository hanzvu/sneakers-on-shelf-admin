import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: {
            id: null,
            userTokenQuery: null
        }
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        removeCart: state => {
            state.cart = {
                id: null,
                userTokenQuery: null
            }
        }
    }
})

export const { setCart, removeCart } = cartSlice.actions
export default cartSlice.reducer