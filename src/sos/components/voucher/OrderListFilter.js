import { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import Iconify from "../../../components/Iconify";

const SORT_BY_OPTIONS = {
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
    'INACTIVE': { value: 'INACTIVE', label: 'Ngừng kích hoạt' },
    '': { value: null, label: 'Tất Cả' },
};


export default function VoucherListFilter({ value, handleStatusFilter }) {

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleChange = value => {
        handleStatusFilter(value);
        handleClose();
    }

    return (
        <>
            <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}>
                Trạng Thái :&nbsp;
                <Typography component="span" variant="subtitle2" color={"seagreen"}>
                    {SORT_BY_OPTIONS[value] == null ? "Tất Cả" : SORT_BY_OPTIONS[value].label}
                </Typography>
            </Button>
            <Menu
                keepMounted
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {
                    Object.values(SORT_BY_OPTIONS).map(option => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === value}
                            onClick={() => handleChange(option.value)}
                            sx={{ typography: 'body2' }}>
                            {option.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}