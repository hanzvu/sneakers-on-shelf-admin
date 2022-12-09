import * as Yup from 'yup';

import { useState, forwardRef } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogContent, Slide, Stack, Typography } from "@mui/material";
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { createMaterial, updateMaterialStatus } from '../../services/MaterialService';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMaterialDialog({ onSuccess }) {

    const [open, setOpen] = useState(false);

    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên vật liệu.'),
    });

    const defaultValues = {
        name: '',
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (material) => {
        createMaterial(material).then(() => {
            onSuccess();
            setOpen(false);
            reset();
        })
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                Thêm Chất Liệu
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
                    THÊM VẬT LIỆU
                </Typography>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            <RHFTextField name="name" label="Tên vật liệu" />
                            <Stack direction={"row"} justifyContent={"center"}>
                                <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                                    Xác nhận
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}