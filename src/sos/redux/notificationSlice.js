import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        data: {}
    },
    reducers: {
        addNotification: (state, action) => {
            state.data = { [action.payload.id]: action.payload, ...state.data };
        },
        clearNotifications: (state, action) => {
            state.data = {};
        },
        markNotificationAsRead: (state, action) => {
            state.data = { ...state.data, [action.payload.id] : {
                ...state.data[action.payload.id],
                isUnRead : false
            } };
        }
    }
})

export const { addNotification, clearNotifications, markNotificationAsRead } = notificationSlice.actions
export default notificationSlice.reducer