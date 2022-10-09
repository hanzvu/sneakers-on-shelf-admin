import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        modal: {
            title: ``,
            text: ``,
            open: false
        }
    },
    reducers: {
        openModal: (state, action) => {
            state.modal = { ...action.payload, open: true }
        },
        closeModal: (state) => {
            state.modal = {
                title: ``,
                text: ``,
                open: false
            }
        }
    }
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer