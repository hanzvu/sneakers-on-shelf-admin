import { useEffect, useState } from "react";
import { Container, Grid, Stack, TextField } from "@mui/material";
import DistrictSelector from "./DistrictSelector";
import { fetchProvincesToStore } from "../../services/DeliveryService";
import ProvinceSelector from "./ProvinceSelector";
import WardSelector from "./WardSelector";

export default function AccountAddressForm({ haveEmail, addressFormInput, setAddressFormInput, handleAddressSelectDone }) {

    useEffect(() => {
        fetchProvincesToStore();
    }, [])

    const setProvince = province => {
        setAddressFormInput({ ...addressFormInput, province, district: null, ward: null })
    }

    const setDistrict = district => {
        setAddressFormInput({ ...addressFormInput, district, ward: null })
    }

    const setWard = ward => {
        setAddressFormInput({ ...addressFormInput, ward })
        if (handleAddressSelectDone != null) {
            handleAddressSelectDone(ward.WardCode);
        }
    }

    return (<>
        <Container disableGutters>
            <Stack spacing={2} alignItems={"flex-end"}>
                <TextField label="Họ và tên" value={addressFormInput.fullname} onChange={e => { setAddressFormInput({ ...addressFormInput, fullname: e.target.value }) }} variant="outlined" fullWidth />
                <TextField label="Số điện thoại" value={addressFormInput.phone} onChange={e => { setAddressFormInput({ ...addressFormInput, phone: e.target.value }) }} variant="outlined" fullWidth />
                {haveEmail && <TextField label="Email" type="email" value={addressFormInput.email} onChange={e => { setAddressFormInput({ ...addressFormInput, email: e.target.value }) }} variant="outlined" fullWidth />}
                <Grid container spacing={1}>
                    <Grid item md={4} xs={12}>
                        <ProvinceSelector setProvince={setProvince} />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <DistrictSelector setDistrict={setDistrict} />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <WardSelector setWard={setWard} />
                    </Grid>
                </Grid>
                <TextField label="Địa chỉ" onChange={e => { setAddressFormInput({ ...addressFormInput, address: e.target.value }) }} variant="outlined" fullWidth />
            </Stack>
        </Container>
    </>)
}