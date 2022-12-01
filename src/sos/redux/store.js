import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import notificationReducer from './notificationSlice'
import accountReducer from './accountSlice'
import modalReducer from './modalSlice'
import snackbarReducer from './snackbarSlice'
import ghnProvinceReducer from './ghnProvinceSlice'
import ghnDistrictReducer from './ghnDistrictSlice'
import ghnWardReducer from './ghnWardSlice'

export default configureStore({
    reducer: {
        notification: notificationReducer,
        cart: cartReducer,
        account: accountReducer,
        modal: modalReducer,
        snackbar: snackbarReducer,
        ghnProvince: ghnProvinceReducer,
        ghnDistrict: ghnDistrictReducer,
        ghnWard: ghnWardReducer
    }
})