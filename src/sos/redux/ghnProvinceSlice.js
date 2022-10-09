import { createSlice } from '@reduxjs/toolkit'

export const ghnProvinceSlice = createSlice({
    name: 'ghnProvince',
    initialState: {
        provinces: [

        ]
    },
    reducers: {
        setProvinces: (state, action) => {
            state.provinces = action.payload;
        }
    }
})

export const { setProvinces } = ghnProvinceSlice.actions
export default ghnProvinceSlice.reducer