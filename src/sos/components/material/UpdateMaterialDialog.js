import * as Yup from 'yup';

import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, Slide, Stack, Typography } from "@mui/material";
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { updateMaterialName } from '../../services/MaterialService';
import { showSnackbar } from '../../services/NotificationService';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateMaterialDialog({ material, setMaterial, onSuccess }) {

    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên vật liệu.'),
    });

    const defaultValues = {
        name: material ? material.name : '',
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

    const onSubmit = async (data) => {
        updateMaterialName(material.id, data).then(() => {
            setMaterial(null);
            onSuccess();
            showSnackbar('Cập nhật vật liệu thành công.');
        }).catch(() => {
            showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error');
        })
    };

    const handleClose = () => {
        setMaterial(null);
    };

    return (
        <>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={material != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description">
                <Typography variant='h4' color={"dimgray"} textAlign={"center"} py={1}>
                    CẬP NHẬT VẬT LIỆU
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