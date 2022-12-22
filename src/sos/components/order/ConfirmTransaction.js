import { forwardRef, useState, useEffect } from "react";
import { Box, Button, Chip, Dialog, DialogContent, FormControlLabel, Grid, Pagination, Slide, Stack, styled, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { showSnackbar } from "../../services/NotificationService";
import { createTransaction } from "../../services/TransactionService";
import { fCurrency, toVietnamese } from "../../../utils/formatNumber";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

export default function ConfirmTransaction({ data, onCreateTransaction }) {

    const [open, setOpen] = useState(false);

    const [reverse, setReverse] = useState(false);

    const [amount, setAmount] = useState(data.orderStatus.name === 'CANCELLED' ? Math.abs(data.transactions.paymentAmount - data.transactions.reverseAmount) : Math.abs(data.requiredAmount - data.transactions.paymentAmount + data.transactions.reverseAmount));

    const onSubmit = (paymentMethod) => {
        if (amount <= 0) {
            showSnackbar("Số tiền không hợp lệ.", "warning");
            return;
        }
        createTransaction({ order: { id: data.id }, amount: Number(amount), paymentMethod, transactionType: reverse ? 'REVERSE' : 'PAYMENT' }).then(() => {
            onCreateTransaction();
            setOpen(false);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        })
    }

    return (
        <>
            <Button variant="outlined" size="medium" onClick={() => setOpen(true)}>
                Xác Nhận Thanh Toán
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
                                XÁC NHẬN {reverse ? 'HOÀN TIỀN' : 'THANH TOÁN'}
                            </Typography>
                            <Box>
                                <FormControlLabel checked={reverse} onChange={() => { setReverse((prev) => !prev) }} control={<IOSSwitch sx={{ m: 1 }} />} label="Hoàn Tiền" />
                            </Box>
                        </Grid>
                        <TextField value={amount} onChange={e => { setAmount(e.target.value) }} variant="outlined" label="Số tiền" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1 }} />
                        <TextField variant="outlined" multiline label="Mô tả" minRows={3} fullWidth />
                        <Stack>
                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <Typography variant="body1" color={"dimgray"}>
                                        Bằng số
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color={"crimson"} display="inline">
                                        {fCurrency(Number(amount))}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <Typography variant="body1" color={"dimgray"}>
                                        Bằng chữ
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" color={"crimson"}>
                                        {`${capitalizeFirstLetter(toVietnamese(Number(amount)))} đồng`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack justifyContent={"flex-end"} direction={"row"} spacing={1}>
                            <Button variant="outlined" color="secondary" onClick={() => { onSubmit('CASH') }}>TIỀN MẶT</Button>
                            <Button variant="outlined" color="success" onClick={() => { onSubmit('BANKING') }}>CHUYỂN KHOẢN</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}