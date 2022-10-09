import { createSlice } from '@reduxjs/toolkit'

export const ghnDistrictSlice = createSlice({
    name: 'ghnDistrict',
    initialState: {
        districts: [

        ]
    },
    reducers: {
        setDistricts: (state, action) => {
            state.districts = action.payload;
        }
    }
})

export const { setDistricts } = ghnDistrictSlice.actions
export default ghnDistrictSlice.reducer