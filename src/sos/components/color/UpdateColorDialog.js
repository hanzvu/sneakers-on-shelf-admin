import * as Yup from 'yup';

import { useState, forwardRef } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Container, Dialog, DialogContent, Slide, Stack, Typography } from "@mui/material";
import { SketchPicker } from 'react-color';
import Iconify from '../../../components/Iconify';
import { createColor, updateColor } from '../../services/ColorService';
import { showSnackbar } from '../../services/NotificationService';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateColorDialog({ color, setColor, onSuccess }) {

    const [code, setCode] = useState(color.code);

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChangeColor = data => {
        setCode(data);
    }

    const handleSubmit = () => {
        setIsSubmitting(true);
        updateColor(color.id, { code: code.hex }).then(() => {
            setColor(null);
            onSuccess();
        }).catch(() => {
            showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error');
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={color != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setColor(null) }}
                aria-describedby="alert-dialog-slide-description">
                <Typography variant='h4' color={"dimgray"} textAlign={"center"} py={2}>
                    CẬP NHẬT MÀU SẢN PHẨM
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