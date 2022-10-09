import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import modalReducer from './modalSlice'
import ghnProvinceReducer from './ghnProvinceSlice'
import ghnDistrictReducer from './ghnDistrictSlice'
import ghnWardReducer from './ghnWardSlice'

export default configureStore({
    reducer: {
        cart: cartReducer,
        modal: modalReducer,
        ghnProvince: ghnProvinceReducer,
        ghnDistrict: ghnDistrictReducer,
        ghnWard: ghnWardReducer
    }
})