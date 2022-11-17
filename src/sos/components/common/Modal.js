import { Modal, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from "../../redux/modalSlice";

const style = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function NotifyModal() {

    const modal = useSelector(state => state.modal.modal);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal())
    }

    return (<>
        <Modal
            open={modal.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                {
                    modal.title &&
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                        {modal.title}
                    </Typography>
                }
                <Box className="d-flex justify-content-center">
                    <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
                        {modal.text}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    </>)
}