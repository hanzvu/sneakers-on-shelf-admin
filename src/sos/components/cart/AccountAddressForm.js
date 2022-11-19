import { useEffect, useState } from "react";
import { Container, Grid, Stack, TextField } from "@mui/material";
import DistrictSelector from "./DistrictSelector";
import { fetchProvincesToStore } from "../../services/DeliveryService";
import ProvinceSelector from "./ProvinceSelector";
import WardSelector from "./WardSelector";

export default function AccountAddressForm({ haveEmail, data, addressFormInputChange, handleDone }) {

    useEffect(() => {
        fetchProvincesToStore();
    }, [])

    const setProvince = province => {
        addressFormInputChange({ ...data, province, district: null, ward: null })
    }

    const setDistrict = district => {
        addressFormInputChange({ ...data, district, ward: null })
    }

    const setWard = ward => {
        addressFormInputChange({ ...data, ward })
        if (handleDone != null) {
            handleDone(ward.WardCode);
        }
    }

    return (<>
        <Container disableGutters>
            <Stack spacing={2} alignItems={"flex-end"}>
                <TextField label="Họ và tên" value={data.fullname} onChange={e => { addressFormInputChange({ ...data, fullname: e.target.value }) }} variant="outlined" fullWidth />
                <TextField label="Số điện thoại" value={data.phone} onChange={e => { addressFormInputChange({ ...data, phone: e.target.value }) }} variant="outlined" fullWidth />
                {haveEmail && <TextField label="Email" type="email" value={data.email} onChange={e => { addressFormInputChange({ ...data, email: e.target.value }) }} variant="outlined" fullWidth />}
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
                <TextField label="Địa chỉ" onChange={e => { addressFormInputChange({ ...data, address: e.target.value }) }} variant="outlined" fullWidth />
            </Stack>
        </Container>
    </>)
}