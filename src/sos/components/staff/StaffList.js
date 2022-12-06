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
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import CollectionSorter from "../common/CollectionSorter";
import { getPageAccount, updateAccountStatus } from "../../services/AccountService";
import { showSnackbar } from "../../services/NotificationService";
import { getPageStaff } from "../../services/StaffService";
import ImportStaff from "./ImportStaff";

export default function StaffList() {

    const navigate = useNavigate();

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchData();
    }, [searchParams])

    const fetchData = () => {
        getPageStaff(Object.fromEntries(searchParams.entries())).then(data => {
            setData(data);
        })
    }

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

    const handleSetAccountStatus = (id, accountStatus) => {
        updateAccountStatus(id, accountStatus).then(() => {
            fetchData();
        }).catch(() => {
            showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error');
        })
    }

    return (<>
        {data &&
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item md={6}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                            </Stack>
                        </Grid>
                        <Grid item md={6}>
                            <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                                <CollectionSorter value={searchParams.get('status')}
                                    title="Trạng thái"
                                    defaultValue="Tất cả"
                                    handleChange={status => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            status
                                        })
                                    }}
                                    options={ACCOUNT_STATUS_OPTIONS}
                                />
                                <Link to={"/dashboard/staff/new"} className="text-decoration-none">
                                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                        Tạo tài khoản
                                    </Button>
                                </Link>
                                <ImportStaff onSuccess={fetchData}/>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Ảnh</TableCell>
                                    <TableCell align="center">Tên Tài Khoản</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Họ Và Tên</TableCell>
                                    <TableCell align="center" width={"13%"}>Ngày Tạo</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center" colSpan={2}>Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.content && data.content.map(account => (
                                        <TableRow
                                            hover
                                            key={account.id}
                                            tabIndex={-1}
                                            role="checkbox">
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {account.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Avatar src={account.picture} alt="photoURL" imgProps={{ referrerPolicy: "no-referrer" }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {account.username}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {account.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {account.fullname}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(account.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={account.accountStatus.description} color={account.accountStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction={"row"} spacing={1}>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <Link to={`/dashboard/staff/${account.id}`} className="text-decoration-none">
                                                            <IconButton aria-label="edit" size="medium" color="primary">
                                                                <Iconify icon="eva:edit-2-fill" />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
                                                    {
                                                        account.accountStatus.name === 'ACTIVE' ?
                                                            <Tooltip title="Hủy kích hoạt">
                                                                <IconButton aria-label="inactive" size="medium" color="error" onClick={() => { handleSetAccountStatus(account.id, 'INACTIVE') }}>
                                                                    <Iconify icon="material-symbols:inactive-order-outline-rounded" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="Kích hoạt">
                                                                <IconButton aria-label="active" size="medium" color="warning" onClick={() => { handleSetAccountStatus(account.id, 'ACTIVE') }}>
                                                                    <Iconify icon="material-symbols:inactive-order-rounded" />
                                                                </IconButton>
                                                            </Tooltip>
                                                    }
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
                                to={`/dashboard/staff${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </Card>
        }
    </>);
}

const ACCOUNT_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'INACTIVE': { value: 'INACTIVE', label: 'Hủy kích hoạt' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
}