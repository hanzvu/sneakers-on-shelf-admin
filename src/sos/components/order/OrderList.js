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

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { getAllOrder } from "../../services/OrderService";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";
import OrderListFilter from "./OrderListFilter";
import { createCart } from "../../services/CartService";
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

    const handleStatusFilter = status => {
        if (status) {
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                status
            })
            return;
        }
        setSearchParams({})
    }

    const handleCreateCart = () => {
        createCart().then(data => {
            navigate(`/dashboard/carts/${data.id}`);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    return (<>
        {
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item xs={7}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Đơn Hàng" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                {
                                    searchParams.get('query') &&
                                    <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                                }
                            </Stack>
                        </Grid>
                        <Grid item xs={5} container justifyContent={"flex-end"}>
                            <Box pr={3}>
                                <OrderListFilter value={searchParams.get('status')} handleStatusFilter={handleStatusFilter} />
                            </Box>
                            <Button variant="contained" onClick={handleCreateCart} startIcon={<Iconify icon="eva:plus-fill" />}>
                                Tạo đơn hàng
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Mã Đơn Hàng</TableCell>
                                    <TableCell align="center">Trạng Thái Đơn</TableCell>
                                    <TableCell align="center">Loại Đơn Hàng</TableCell>
                                    <TableCell align="center">Tên Khách Hàng</TableCell>
                                    <TableCell align="center">Số Điện Thoại</TableCell>
                                    <TableCell align="center">Tổng Số Sản Phẩm</TableCell>
                                    <TableCell align="center">Tổng Số Tiền</TableCell>
                                    <TableCell align="center">Ngày Tạo</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map(order => (
                                        <TableRow
                                            hover
                                            key={order.id}
                                            tabIndex={-1}
                                            role="checkbox">
                                            <TableCell align="center">
                                                {order.id}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={order.orderStatus.description} color={order.orderStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={order.saleMethod.description} color={order.saleMethod.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    order.fullname ? order.fullname : <Chip label='Khách Lẻ' color="default" />
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    order.phone ? order.phone : ''
                                                }
                                            </TableCell>
                                            <TableCell align="center" width={"9%"}>{order.productCount}</TableCell>
                                            <TableCell align="center">{fCurrency(order.total)}</TableCell>
                                            <TableCell align="center" width={"10%"}>
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(order.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center"><Link to={`/dashboard/orders/${order.id}`}>Chi Tiết</Link></TableCell>
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
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`/dashboard/orders${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </Card>
        }
    </>)
}
