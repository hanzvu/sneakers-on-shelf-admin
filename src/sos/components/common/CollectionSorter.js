import { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import Iconify from "../../../components/Iconify";

export default function CollectionSorter({ value, handleChange, options, title, defaultValue, color = "seagreen" }) {

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleChangeItem = value => {
        handleChange(value);
        handleClose();
    }

    return (
        <>
            <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}>
                {title} :&nbsp;
                <Typography component="span" variant="subtitle2" color={color}>
                    {options[value] == null ? defaultValue : options[value].label}
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
                    Object.values(options).map(option => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === value}
                            onClick={() => handleChangeItem(option.value)}
                            sx={{ typography: 'body2' }}>
                            {option.label}
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}