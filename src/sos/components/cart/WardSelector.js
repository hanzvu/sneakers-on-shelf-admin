import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function WardSelector({ setWard }) {

    const [selectedWard, setSelectedWard] = useState(``);

    const wards = useSelector(state => state.ghnWard.wards);

    const handleChange = (event) => {
        setWard(wards[event.target.value])
        setSelectedWard(event.target.value);
    };

    return (<>
        <FormControl sx={{ minWidth: 120 }} fullWidth>
            <InputLabel id="ward-select-helper-label">Phường / Xã</InputLabel>
            <Select
                labelId="ward-select-helper-label"
                id="ward-select-helper"
                value={selectedWard}
                label="Phường / Xã"
                onChange={handleChange}>

                {
                    wards &&
                    Object.values(wards).map(ward => (
                        <MenuItem key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    </>)

}