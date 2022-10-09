import { createSlice } from '@reduxjs/toolkit'

export const ghnWardSlice = createSlice({
    name: 'ghnWard',
    initialState: {
        wards: [

        ]
    },
    reducers: {
        setWards: (state, action) => {
            state.wards = action.payload;
        }
    }
})

export const { setWards } = ghnWardSlice.actions
export default ghnWardSlice.reducer