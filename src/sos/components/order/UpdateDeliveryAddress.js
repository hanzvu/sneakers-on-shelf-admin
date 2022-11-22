import { forwardRef, useState } from "react";
import { Button, Dialog, DialogContent, Grid, Slide, Stack, TextField, Typography } from "@mui/material";
import { showSnackbar } from "../../services/NotificationService";
import AccountAddressForm from "../cart/AccountAddressForm";
import { updateOrderAddress } from "../../services/OrderService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateDeliveryAddress({ data, onChangeDeliveryAddress }) {

    const [open, setOpen] = useState(false);

    const [addressFormInput, setAddressFormInput] = useState({
        province: null,
        district: null,
        ward: null,
        fullname: data.fullname,
        phone: data.phone,
        address: '',
        email: '',
        description: ''
    })

    const onSubmit = () => {
        if (addressFormInput.province == null || addressFormInput.district == null || addressFormInput.ward == null || addressFormInput.address.trim().length === 0 || addressFormInput.fullname.trim().length === 0 || addressFormInput.phone.trim().length === 0) {
            showSnackbar("Bạn chưa chọn xong địa chỉ.", "warning")
            return;
        }

        const customerInfo = {
            fullname: addressFormInput.fullname,
            phone: addressFormInput.phone,
            address: addressFormInput.address,
            provinceId: addressFormInput.province.ProvinceID,
            provinceName: addressFormInput.province.ProvinceName,
            districtId: addressFormInput.district.DistrictID,
            districtName: addressFormInput.district.DistrictName,
            wardCode: addressFormInput.ward.WardCode,
            wardName: addressFormInput.ward.WardName
        }

        updateOrderAddress(data.id, {customerInfo, description: addressFormInput.description}).then(() => {
            onChangeDeliveryAddress();
            setOpen(false);
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
            <Button variant="outlined" size="medium" onClick={() => setOpen(true)}>
                Cập Nhật
            </Button>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={open}
                onClose={() => { setOpen(false) }}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Stack spacing={2}>
                        <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                            <Typography variant="h5">
                                CẬP NHẬT ĐƠN HÀNG
                            </Typography>
                        </Grid>
                        <Stack spacing={2}>
                            <AccountAddressForm addressFormInput={addressFormInput} setAddressFormInput={setAddressFormInput} />
                            <TextField value={addressFormInput.description} onChange={e => { setAddressFormInput({ ...addressFormInput, description: e.target.value }) }} variant="outlined" multiline label="Mô tả" minRows={3} fullWidth />
                        </Stack>
                        <Stack justifyContent={"flex-end"} direction={"row"} spacing={1}>
                            <Button variant="outlined" onClick={onSubmit}>Cập Nhật</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}