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
    IconButton,
    Tooltip,
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";
import { cancelCartById, createCart, getAllCart } from "../../services/CartService";
// material

export default function CartList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        getAllCart(Object.fromEntries(searchParams.entries())).then(data => {
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

    const handleCreateCart = () => {
        createCart().then(data => {
            navigate(`/dashboard/carts/${data.id}`);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    const handleCancellCart = id => {
        cancelCartById(id).then(() => {
            getAllCart(Object.fromEntries(searchParams.entries())).then(data => {
                setData(data)
            });
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    const handleShowCartDetail = id => {
        navigate(`/dashboard/carts/${id}`);
    }

    return (<>
        {
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item xs={9}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Đơn Hàng" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                {
                                    searchParams.get('query') &&
                                    <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                                }
                            </Stack>
                        </Grid>
                        <Grid item xs={3} container justifyContent={"flex-end"}>
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
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Số Sản Phẩm</TableCell>
                                    <TableCell align="center">Tổng Số Tiền</TableCell>
                                    <TableCell align="center">Ngày Tạo</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map((cart, index) => (
                                        <TableRow
                                            hover
                                            key={cart.id}
                                            tabIndex={-1}
                                            role="checkbox">
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {index + 1 + data.size * data.number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {cart.productCount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" color={"crimson"}>
                                                    {fCurrency(cart.total)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(cart.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={cart.cartStatus.description} color={cart.cartStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction={"row"} spacing={2} justifyContent="center">
                                                    <Tooltip title="Chỉnh sửa">
                                                        <Link to={`/dashboard/carts/${cart.id}`}>
                                                            <IconButton aria-label="edit" size="medium" color="primary">
                                                                <Iconify icon="eva:edit-2-fill" />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton aria-label="delete" size="medium" color="error"
                                                            onClick={() => { handleCancellCart(cart.id) }}>
                                                            <Iconify icon="eva:trash-fill" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
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
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`/dashboard/carts${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </Card>
        }
    </>)
}
