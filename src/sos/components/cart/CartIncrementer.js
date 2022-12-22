import { Box, IconButton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Iconify from "../../../components/Iconify";

export default function CartIncrementer({ quantity, onIncrementQuantity, onDecrementQuantity, onBlurHandler }) {

    const [value, setValue] = useState(quantity)

    useEffect(() => {
        setValue(quantity)
    }, [quantity])

    return (
        <Box
            sx={{
                py: 0.5,
                px: 0.75,
                border: 1,
                lineHeight: 0,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                borderColor: 'grey.50032',
            }}
        >
            <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
                <Iconify icon={'eva:minus-fill'} width={14} height={14} />
            </IconButton>

            <TextField type={"number"} variant="standard" value={value} onChange={e => {
                if (e.target.value >= 1 && Number.isInteger(Number(e.target.value))) {
                    setValue(e.target.value)
                }
            }
            } onBlur={e => onBlurHandler(value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]', min: 1, style: { textAlign: 'center' } }} sx={{ width: 40, textAlign: 'center' }} />

            <IconButton size="small" color="inherit" onClick={onIncrementQuantity}>
                <Iconify icon={'eva:plus-fill'} width={14} height={14} />
            </IconButton>
        </Box>
    );
}