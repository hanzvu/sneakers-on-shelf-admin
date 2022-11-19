import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "../../redux/snackbarSlice";

export default function MySnackbar() {

    const data = useSelector(state => state.snackbar.data)
    const dispatch = useDispatch()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeSnackbar())
    };

    if (data.data == null) {
        return;
    }

    return (
        <Snackbar open={data.data.open} autoHideDuration={4000} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }} onClose={handleClose}>
            <Alert onClose={handleClose} variant="filled" severity={data.data.severity} sx={{ width: '100%' }}>
                {data.data.message}
            </Alert>
        </Snackbar>
    )
}