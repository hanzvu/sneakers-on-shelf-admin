import { createSlice } from '@reduxjs/toolkit'

export const snackbarSlice = createSlice({
    name: 'cart',
    initialState: {
        data: {
            open: false,
            message: null,
            severity: "success"
        }
    },
    reducers: {
        setSnackbar: (state, action) => {
            state.data = action.payload;
        },
        closeSnackbar: (state) => {
            state.data = {
                open: false,
                message: null,
                severity: "success"
            }
        }
    }
})

export const { setSnackbar, closeSnackbar } = snackbarSlice.actions
export default snackbarSlice.reducer