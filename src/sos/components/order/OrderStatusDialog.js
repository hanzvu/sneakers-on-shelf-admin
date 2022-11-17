import { Box, Button, Dialog, DialogContent, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { useState, forwardRef } from "react";
import { showSnackbar } from "../../services/NotificationService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderStatusDialog({ buttonTitle, color, dialogTitle, hidden, required, value, onSubmitEvent }) {

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = () => {
        if (required && text.trimStart().trimEnd().length === 0) {
            showSnackbar("Vui lòng nhập ghi chú.", "warning");
            return;
        }
        onSubmitEvent({ description: text, orderStatus: value });
        setText('');
        setOpen(false);
    }


    return (
        hidden ? null :
            <>
                <Button variant="contained" color={color} size="large" onClick={handleClickOpen}>
                    {buttonTitle}
                </Button>
                <Dialog
                    maxWidth={"md"}
                    fullWidth
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent sx={{ zIndex: 'modal' }}>
                        <Box pt={1}>
                            <TextField id="outlined-basic" label="Ghi Chú" variant="outlined" size="small" multiline rows={5} fullWidth value={text} onChange={e => { setText(e.target.value) }} />
                        </Box>
                        <Stack direction={"row"} justifyContent="flex-end" pt={2}>
                            <Button variant="contained" size="large" onClick={onSubmit} >Xác Nhận</Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </>
    )
}