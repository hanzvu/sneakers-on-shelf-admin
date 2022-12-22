import { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import SquareIcon from '@mui/icons-material/Square';
import Iconify from "../../../components/Iconify";

export default function CollectionColorSorter({ value, handleChange, options, title, defaultValue, color = "seagreen" }) {

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
                {
                    options[value] == null ?
                        <Typography component="span" variant="subtitle2" color={color}>{defaultValue}</Typography>
                        :
                        <SquareIcon style={{ fill: options[value].code }} />
                }
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
                            <SquareIcon style={{ fill: option.code }} />
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}