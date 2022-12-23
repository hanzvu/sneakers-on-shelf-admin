import { useState, useEffect } from "react";
import { Link, Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { getAllOrder } from "../../services/OrderService";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";
import { createCart } from "../../services/CartService";
import CollectionSorter from "../common/CollectionSorter";
// material

export default function OrderList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        getAllOrder(Object.fromEntries(searchParams.entries())).then(data => {
            setData(data);
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

    const handleCreateCart = () => {
        createCart().then(data => {
            navigate(`/dashboard/carts/${data.id}`);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    const handleShowOrderDetail = id => {
        navigate(`/dashboard/orders/${id}`);
    }

    return (<>
        {
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item container xs={9}>
                            <Grid item xs={7}>
                                <Stack direction={"row"} spacing={1}>
                                    <TextField id="outlined-basic" label="Tìm Đơn Hàng" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                    <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                    <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={3} direction="row">
                                        <DatePicker
                                            label="Từ ngày"
                                            inputFormat='DD/MM/YYYY'
                                            maxDate={searchParams.get('to-date') ? new Date(searchParams.get('to-date')) : new Date()}
                                            value={searchParams.get('from-date') ? new Date(searchParams.get('from-date')) : null}
                                            onChange={(newValue) => {
                                                try {
                                                    setSearchParams({
                                                        ...Object.fromEntries(searchParams.entries()),
                                                        'from-date': new Date(newValue.$d.getTime() - (newValue.$d.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0]
                                                    })
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}
                                            renderInput={(params) => <TextField size="small" {...params} />}
                                        />
                                        <DatePicker
                                            label="Đến ngày"
                                            inputFormat='DD/MM/YYYY'
                                            maxDate={new Date()}
                                            minDate={searchParams.get('from-date') ? new Date(searchParams.get('from-date')) : null}
                                            value={searchParams.get('to-date') ? new Date(searchParams.get('to-date')) : null}
                                            onChange={(newValue) => {
                                                try {
                                                    setSearchParams({
                                                        ...Object.fromEntries(searchParams.entries()),
                                                        'to-date': new Date(newValue.$d.getTime() - (newValue.$d.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0]
                                                    })
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}
                                            renderInput={(params) => <TextField size="small" {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} container justifyContent={"flex-end"}>
                            <Box pr={3}>
                                <Button variant="contained" onClick={handleCreateCart} startIcon={<Iconify icon="eva:plus-fill" />}>
                                    Tạo đơn hàng
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item container justifyContent={"center"}>
                            <Stack spacing={3} direction="row">
                                <CollectionSorter value={searchParams.get('status')}
                                    title="Trạng thái"
                                    defaultValue="Tất cả"
                                    handleChange={status => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            status
                                        })
                                    }}
                                    options={ORDER_STATUS_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('method')}
                                    title="Loại đơn"
                                    defaultValue="Tất cả"
                                    handleChange={method => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            method
                                        })
                                    }}
                                    options={SALE_METHOD_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('sort')}
                                    title="Sắp xếp"
                                    defaultValue="Mặc định"
                                    handleChange={sort => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            sort
                                        })
                                    }}
                                    options={SORT_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('size')}
                                    title="Hiển thị"
                                    defaultValue="10"
                                    handleChange={size => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            size
                                        })
                                    }}
                                    options={SIZE_OPTIONS}
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
                                    <TableCell align="center">Mã Đơn Hàng</TableCell>
                                    <TableCell align="center" width={"9%"}>Tổng Số Sản Phẩm</TableCell>
                                    <TableCell align="center">Tổng Số Tiền</TableCell>
                                    <TableCell align="center">Tên Khách Hàng</TableCell>
                                    <TableCell align="center">Số Điện Thoại</TableCell>
                                    <TableCell align="center" width={"10%"}>Ngày Tạo</TableCell>
                                    <TableCell align="center">Loại Đơn Hàng</TableCell>
                                    <TableCell align="center">Trạng Thái Đơn</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map((order, index) => (
                                        <TableRow
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "#D5D5D5 !important"
                                                }
                                            }}
                                            key={order.id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            onClick={() => { handleShowOrderDetail(order.id) }}>
                                            <TableCell align="center">
                                                <Typography variant="subtitle2">
                                                    {index + 1 + data.size * data.number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="subtitle2" color="grey">
                                                    {order.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">{order.productCount}</TableCell>
                                            <TableCell align="center">
                                                <Typography color={"crimson"} variant={"body2"}>
                                                    {fCurrency(order.total)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    order.fullname ?
                                                        <Typography variant={"body2"}>
                                                            {order.fullname}
                                                        </Typography> : <Chip label='Khách Lẻ' color="default" />
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant={"body2"}>
                                                    {order.phone ? order.phone : ''}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(order.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={order.saleMethod.description} color={order.saleMethod.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={order.orderStatus.description} color={order.orderStatus.color} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                {
                                    data.content.length === 0 &&
                                    <TableRow>
                                        <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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

const SORT_OPTIONS = {
    '': { value: '', label: 'Mặc định' },
    'total_desc': { value: 'total_desc', label: 'Giá trị giảm dần' },
    'total_asc': { value: 'total_asc', label: 'Giá trị tăng dần' },
    'date_desc': { value: 'date_desc', label: 'Mới nhất' },
    'date_asc': { value: 'date_asc', label: 'Cũ nhất' },
}

const ORDER_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất Cả' },
    'PENDING': { value: 'PENDING', label: 'Đang chờ xác nhận' },
    'CONFIRMED': { value: 'CONFIRMED', label: 'Đã xác nhận' },
    'SHIPPING': { value: 'SHIPPING', label: 'Đang vận chuyển' },
    'CANCELLED': { value: 'CANCELLED', label: 'Đã hủy' },
    'APPROVED': { value: 'APPROVED', label: 'Đã hoàn thành' },
}

const SALE_METHOD_OPTIONS = {
    '': { value: '', label: 'Tất Cả' },
    'DELIVERY': { value: 'DELIVERY', label: 'Giao hàng' },
    'RETAIL': { value: 'RETAIL', label: 'Tại quầy' },
}

const SIZE_OPTIONS = {
    '': { value: '', label: '10' },
    25: { value: 25, label: '25' },
    50: { value: 50, label: '50' },
    100: { value: 100, label: '100' },
}