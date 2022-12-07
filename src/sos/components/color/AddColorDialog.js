import * as Yup from 'yup';

import { useState, forwardRef } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Dialog, DialogContent, Slide, Stack, Typography } from "@mui/material";
import { SketchPicker } from 'react-color';
import Iconify from '../../../components/Iconify';
import { createColor } from '../../services/ColorService';
import { showSnackbar } from '../../services/NotificationService';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddColorDialog({ onSuccess }) {

    const [open, setOpen] = useState(false);

    const [code, setCode] = useState({
        "hsl": {
            "h": 0,
            "s": 1,
            "l": 0.99905,
            "a": 1
        },
        "hex": "#ffffff",
        "rgb": {
            "r": 255,
            "g": 255,
            "b": 255,
            "a": 1
        },
        "hsv": {
            "h": 0,
            "s": 0.0019000000000000128,
            "v": 1,
            "a": 1
        },
        "oldHue": 0,
        "source": "hsv"
    });

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeColor = color => {
        setCode(color);
    }

    const handleSubmit = () => {
        setIsSubmitting(true);
        createColor({ code: code.hex }).then(() => {
            setOpen(false);
            onSuccess();
        }).catch(() => {
            showSnackbar('Có lỗi xảy ra, hãy thử lại sau.');
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm Màu
            </Button>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description">
                <Typography variant='h4' color={"dimgray"} textAlign={"center"} py={2}>
                    THÊM MÀU SẢN PHẨM
                </Typography>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Stack spacing={4}>
                        <Stack direction="row" justifyContent={"center"}>
                            <SketchPicker color={code} onChangeComplete={handleChangeColor} />
                        </Stack>
                        <Stack direction={"row"} justifyContent={"center"}>
                            <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} onClick={handleSubmit}>
                                Xác nhận
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}