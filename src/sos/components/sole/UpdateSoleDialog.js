import * as Yup from 'yup';

import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, Slide, Stack, Typography } from "@mui/material";
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { showSnackbar } from '../../services/NotificationService';
import { updateSoleName } from '../../services/SoleService';

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateSoleDialog({ sole, setSole, onSuccess }) {

    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên đế giày.'),
    });

    const defaultValues = {
        name: sole ? sole.name : '',
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
        updateSoleName(sole.id, data).then(() => {
            setSole(null);
            onSuccess();
            showSnackbar('Cập nhật vật liệu thành công.');
        }).catch(() => {
            showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error');
        })
    };

    const handleClose = () => {
        setSole(null);
    };

    return (
        <>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={sole != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description">
                <Typography variant='h4' color={"dimgray"} textAlign={"center"} py={2}>
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