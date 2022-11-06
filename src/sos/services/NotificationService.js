import { openModal } from '../redux/modalSlice';
import { setSnackbar } from '../redux/snackbarSlice';
import store from '../redux/store';

const showModal = (title, text) => {
    store.dispatch(openModal({
        title, text
    }))
}

const showSnackbar = (message, severity = "success") => {
    store.dispatch(setSnackbar({
        data: {
            open: true,
            message,
            severity
        }
    }))
}

export { showModal, showSnackbar }