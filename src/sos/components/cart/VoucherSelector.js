import { forwardRef, useState, useEffect } from "react";
import { Button, Chip, Dialog, DialogContent, Grid, Pagination, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { findAvailableVouchers } from "../../services/VoucherService";
import Scrollbar from "../../../components/Scrollbar";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function VoucherSelector({ value, handleSelectVoucher }) {

    const [open, setOpen] = useState(false);

    const [query, setQuery] = useState('');

    const [data, setData] = useState({ content: [] });

    useEffect(() => {
        findAvailableVouchers().then(data => {
            setData(data);
        })
    }, [])

    const handleClick = voucher => {
        handleSelectVoucher(voucher);
        setOpen(false);
    }

    const handleSearch = () => {
        const params = query.trimStart().trimEnd().length > 0 ? { query } : {};
        findAvailableVouchers(params).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }


    const handleChangePage = (event, page) => {
        const params = query.trimStart().trimEnd().length > 0 ? { query } : {};
        findAvailableVouchers({ ...params, page }).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    return (
        <>
            <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
                Chọn Mã Giảm Giá
            </Button>
            <Dialog
                maxWidth={"lg"}
                fullWidth
                open={open}
                onClose={() => { setOpen(false) }}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Grid container spacing={3} pt={1}>
                        <Grid item xs={7}>
                            <TextField autoFocus fullWidth label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                        </Grid>
                        <Grid item container xs={5}>
                            <Button variant="contained" onClick={handleSearch}>Tìm Kiếm</Button>
                        </Grid>
                    </Grid>
                    <Scrollbar>
                        <TableContainer sx={{ minHeight: 400 }} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Mã</TableCell>
                                        <TableCell align="center">Giá Trị</TableCell>
                                        <TableCell align="center">Giá Trị Tối Đa</TableCell>
                                        <TableCell align="center">Cho Đơn Tối Thiểu</TableCell>
                                        <TableCell align="center">Số Lượng</TableCell>
                                        <TableCell align="center">Thời Gian</TableCell>
                                        <TableCell align="center">Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        data.content && data.content.map(voucher => (
                                            <TableRow hover key={voucher.id} tabIndex={-1}>
                                                <TableCell align="center" width={"5%"}>
                                                    <Typography variant="body2" flexWrap>
                                                        {voucher.code}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        voucher.voucherType === 'DISCOUNT' ?
                                                            <Typography variant="body2" color={"crimson"} flexWrap>
                                                                {fCurrency(voucher.amount)}
                                                            </Typography> :
                                                            <Chip label={`${voucher.amount} %`} color="secondary" />
                                                    }

                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color={"crimson"} flexWrap>
                                                        {voucher.maxValue > 0 ? fCurrency(voucher.maxValue) : ''}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {fCurrency(voucher.requiredValue)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {voucher.quantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {`${new Date(voucher.startDate).toLocaleDateString()} - ${new Date(voucher.experationDate).toLocaleDateString()}`}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        value >= voucher.requiredValue &&
                                                        <Button variant="outlined" color="primary" onClick={() => { handleClick(voucher) }}>Chọn</Button>
                                                    }
                                                    {
                                                        value < voucher.requiredValue &&
                                                        <Button variant="outlined" color="error">Không Đủ Điều Kiện</Button>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            data.totalPages &&
                            <Stack alignItems={"center"} spacing={3} py={2}>
                                <Pagination count={data.totalPages} page={data.number + 1} siblingCount={0} onChange={handleChangePage} />
                            </Stack>
                        }
                    </Scrollbar>
                </DialogContent>
            </Dialog>
        </>
    )
}