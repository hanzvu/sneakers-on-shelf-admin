import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
    name: 'account',
    initialState: {
        account: {
            id: null
        }
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload;
        },
        clearAccount: state => {
            state.account = {
                id: null
            }
        }
    }
})

export const { setAccount, clearAccount } = accountSlice.actions
export default accountSlice.reducer