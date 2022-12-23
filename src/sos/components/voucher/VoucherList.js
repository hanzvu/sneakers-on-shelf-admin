import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Button,
    Typography,
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Pagination,
    PaginationItem,
    TableHead,
    Chip,
    TextField,
    Grid,
    Box,
    Tooltip,
    IconButton,
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";
import { findVouchers, invalidVoucher } from "../../services/VoucherService";
import CollectionSorter from "../common/CollectionSorter";
// material

export default function VoucherList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        findVouchers(Object.fromEntries(searchParams.entries())).then(data => {
            setData(data)
        });

    }, [searchParams]);

    const handleSubmitQuery = (e) => {
        e.preventDefault();
        if (query.length == null || query.trimStart().trimEnd().length === 0) {
            showSnackbar("Bạn chưa nhập query.", "warning");
            return;
        }

        setSearchParams({
            query
        })
    }

    const handleRefresh = () => {
        setQuery('');
        setSearchParams({});
    }

    const handleCreateVoucher = () => {
        navigate(`/dashboard/vouchers/create`);
    }

    const handleInactiveVoucher = async (id) => {
        invalidVoucher(id).then(() => {
            findVouchers(Object.fromEntries(searchParams.entries())).then(data => {
                setData(data)
            });
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        })
    }

    const getVoucherColor = (fromDate, toDate) => {
        const now = new Date();
        if (now > toDate) {
            return 'error';
        }
        if (now > fromDate) {
            return 'success'
        }
        return 'primary';
    }

    return (<>
        {
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item xs={7}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Mã Giảm Giá" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={5} container justifyContent={"flex-end"}>
                            <Button variant="contained" onClick={handleCreateVoucher} startIcon={<Iconify icon="eva:plus-fill" />}>
                                Tạo mã giảm giá
                            </Button>
                        </Grid>
                        <Grid item container justifyContent={"flex-end"}>
                            <Stack direction={"row"} spacing={3}>
                                <CollectionSorter value={searchParams.get('status')}
                                    title="Trạng thái"
                                    defaultValue="Tất cả"
                                    handleChange={status => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            status
                                        })
                                    }}
                                    options={STATUS_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('access')}
                                    title="Quyền"
                                    defaultValue="Tất cả"
                                    handleChange={access => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            access
                                        })
                                    }}
                                    options={ACCESS_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('type')}
                                    title="Loại"
                                    defaultValue="Tất cả"
                                    handleChange={type => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            type
                                        })
                                    }}
                                    options={TYPE_OPTIONS}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center" width={"5%"}>Mã</TableCell>
                                    <TableCell align="center" width={"10%"}>Giá Trị</TableCell>
                                    <TableCell align="center" width={"10%"}>Giá Trị Tối Đa</TableCell>
                                    <TableCell align="center" width={"10%"}>Cho Đơn Tối Thiểu</TableCell>
                                    <TableCell align="center" width={"5%"}>Số Lượng</TableCell>
                                    <TableCell align="center">Quyền</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center" width={"14%"}>Thời Gian</TableCell>
                                    <TableCell align="center" width={"15%"}>Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map((voucher, index) => (
                                        <TableRow hover key={voucher.id} tabIndex={-1}>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {index + 1 + data.size * data.number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
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
                                                <Chip label={voucher.voucherAccess.description} color={voucher.voucherAccess.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={voucher.voucherStatus.description} color={voucher.voucherStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={`${new Date(voucher.startDate).toLocaleDateString()} - ${new Date(voucher.experationDate).toLocaleDateString()}`} color={getVoucherColor(voucher.startDate, voucher.experationDate)} />
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    voucher.voucherStatus.name === "ACTIVE" ?
                                                        <Tooltip title="Hủy kích hoạt">
                                                            <IconButton aria-label="inactive" size="medium" color="error" onClick={() => { handleInactiveVoucher(voucher.id) }}>
                                                                <Iconify icon="material-symbols:inactive-order-outline-rounded" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title="Đã hủy">
                                                            <IconButton aria-label="active" size="medium" color="warning" disabled>
                                                                <Iconify icon="material-symbols:inactive-order-rounded" />
                                                            </IconButton>
                                                        </Tooltip>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                {
                                    data.content.length === 0 &&
                                    <TableRow>
                                        <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                                            <Typography gutterBottom align="center" variant="subtitle1">
                                                Không Có Dữ Liệu
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <Stack alignItems={"center"} spacing={3} py={2}>
                    <Pagination
                        page={data.number + 1}
                        count={data.totalPages}
                        onChange={(event, value) => {
                            setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: value });
                        }}
                    />
                </Stack>
            </Card>
        }
    </>)
}

const STATUS_OPTIONS = {
    '': { value: '', label: 'Tất Cả' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
    'INACTIVE': { value: 'INACTIVE', label: 'Đã hủy' },
}

const ACCESS_OPTIONS = {
    '': { value: '', label: 'Tất Cả' },
    'PUBLIC': { value: 'PUBLIC', label: 'Công khai' },
    'PROTECTED': { value: 'PROTECTED', label: 'Giới hạn' },
}

const TYPE_OPTIONS = {
    '': { value: '', label: 'Tất Cả' },
    'DISCOUNT': { value: 'DISCOUNT', label: 'Giảm giá' },
    'PERCENT': { value: 'PERCENT', label: 'Phần trăm' },
}