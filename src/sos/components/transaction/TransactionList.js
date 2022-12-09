import { useEffect, useState } from "react";
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
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { fCurrency } from "../../../utils/formatNumber";
import { findTransactions } from "../../services/TransactionService";
import CollectionSorter from "../common/CollectionSorter";

export default function TransactionList() {

    const navigate = useNavigate();

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        findTransactions(Object.fromEntries(searchParams.entries())).then(data => {
            setData(data);
        });
    }, [searchParams])

    const handleSubmitQuery = (e) => {
        e.preventDefault();
        setSearchParams({
            query
        })
    }

    const handleRefresh = () => {
        setQuery('');
        setSearchParams({});
    }

    const handleShowOrderDetail = id => {
        navigate(`/dashboard/orders/${id}`);
    }

    return (<>
        {data &&
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item md={5}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                            </Stack>
                        </Grid>
                        <Grid item sx={12} container>
                            <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                                <CollectionSorter value={searchParams.get('transaction-status')}
                                    title="Trạng thái"
                                    defaultValue="Tất cả"
                                    handleChange={transactionStatus => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            'transaction-status': transactionStatus
                                        })
                                    }}
                                    options={TRANSACTION_STATUS_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('transaction-type')}
                                    title="Loại"
                                    defaultValue="Tất cả"
                                    handleChange={transactionType => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            'transaction-type': transactionType
                                        })
                                    }}
                                    options={TRANSACTION_TYPE_OPTIONS}
                                />

                                <CollectionSorter value={searchParams.get('payment-method')}
                                    title="Phương Thức"
                                    defaultValue="Tất cả"
                                    handleChange={paymentMethod => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            'payment-method': paymentMethod
                                        })
                                    }}
                                    options={PAYMENT_METHOD_OPTIONS}
                                />

                                <CollectionSorter value={searchParams.get('sort')}
                                    title="Sắp Xếp"
                                    defaultValue="Mới nhất"
                                    handleChange={sort => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            'sort': sort
                                        })
                                    }}
                                    options={SORT_BY_OPTIONS}
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
                                    <TableCell align="center">Số Tiền</TableCell>
                                    <TableCell align="center">Thời Gian</TableCell>
                                    <TableCell align="center">Loại Thanh Toán</TableCell>
                                    <TableCell align="center">Phương Thức Thanh Toán</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Người Xác Nhận</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map((transaction, index) => (
                                        <TableRow
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "#D5D5D5 !important"
                                                }
                                            }}
                                            key={transaction.id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            onClick={() => { handleShowOrderDetail(transaction.orderId) }}>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {index + 1 + data.size * data.number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="subtitle2" color="grey">
                                                    {transaction.orderId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" color={"crimson"}>
                                                    {fCurrency(transaction.amount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(transaction.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={transaction.transactionType.description} color={transaction.transactionType.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={transaction.paymentMethod.description} color={transaction.paymentMethod.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={transaction.transactionStatus.description} color={transaction.transactionStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {transaction.staff}
                                                </Typography>
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
                                to={`/dashboard/transactions${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </Card>
        }
    </>);
}

const SORT_BY_OPTIONS = {
    'date_desc': { value: 'date_desc', label: 'Mới nhất' },
    'amount_asc': { value: 'amount_asc', label: 'Số tiền tăng dần' },
    'amount_desc': { value: 'amount_desc', label: 'Số tiền giảm dần' },
};

const TRANSACTION_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'PENDING': { value: 'PENDING', label: 'Đang chờ' },
    'FAILED': { value: 'FAILED', label: 'Thất bại' },
    'APPROVED': { value: 'APPROVED', label: 'Thành công' },
}

const TRANSACTION_TYPE_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'PAYMENT': { value: 'PAYMENT', label: 'Thanh toán' },
    'REVERSE': { value: 'REVERSE', label: 'Hoàn tiền' },
}

const PAYMENT_METHOD_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'CASH': { value: 'CASH', label: 'Tiền mặt' },
    'BANKING': { value: 'BANKING', label: 'Chuyển khoản' },
}