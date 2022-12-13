import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, Slide, Stack, TextField, Typography } from "@mui/material";
import { useState, forwardRef } from "react";
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { showSnackbar } from "../../services/NotificationService";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { updateMemberOfferPolicy } from "../../services/CartService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateMemberOfferPolicyDialog({ data, setData, onSuccess }) {

    const RegisterSchema = Yup.object().shape({
        offer: Yup.number().typeError('Giá trị ưu đãi không hợp lệ').min(0, "Giá trị ưu đãi phải lớn hơn hoặc bằng 0").max(100, "Giá trị quá lớn").required('Vui lòng nhập ưu đãi.'),
        requiredPoint: Yup.number().typeError('Điểm yêu cầu không hợp lệ').min(0, "Điểm yêu cầu phải lớn hơn hoặc bằng 0").required('Vui lòng nhập điểm yêu cầu.'),
    });

    const defaultValues = {
        offer: data.updatingEntity.offer,
        requiredPoint: data.updatingEntity.requiredPoint
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = (input) => {
        updateMemberOfferPolicy(data.updatingEntity.id, input).then(() => {
            onSuccess();
            setData({ ...data, updatingEntity: null });
            showSnackbar('Cập nhật thành công.')
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    return (
        <>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={data.updatingEntity != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setData({ ...data, updatingEntity: null }) }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>CẬP NHẬT</DialogTitle>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    {
                        data.updatingEntity &&
                        <Stack>
                            <Stack direction={"row"} justifyContent="center">
                                <Chip label={data.updatingEntity.memberRank.description} color={data.updatingEntity.memberRank.color} />
                            </Stack>
                            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3} p={3}>
                                    <RHFTextField type={"number"} name="offer" label="Ưu Đãi (%)" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }} />
                                    <RHFTextField type={"number"} name="requiredPoint" label="Điểm yêu cầu" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }} />
                                </Stack>
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    Xác Nhận
                                </LoadingButton>
                            </FormProvider>
                        </Stack>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}