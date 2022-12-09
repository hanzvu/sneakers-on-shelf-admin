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
    TextField,
    Grid,
    Chip,
    Tooltip,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { showSnackbar } from "../../services/NotificationService";
import CollectionSorter from "../common/CollectionSorter";
import { findSoles, updateSoleStatus } from "../../services/SoleService";
import UpdateSoleDialog from "./UpdateSoleDialog";
import AddSoleDialog from "./AddSoleDialog";

// material

export default function SoleList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [sole, setSole] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const fetchData = () => {
        findSoles(Object.fromEntries(searchParams.entries())).then(data => { setData(data) })
    }

    const handleSubmitQuery = () => {
        if (query.length == null || query.trimStart().trimEnd().length === 0) {
            showSnackbar("Bạn chưa nhập query.", "warning");
            return;
        }

        setSearchParams({
            query
        })
    }

    const handleUpdateStatus = (id, status) => {
        updateSoleStatus(id, status).then(() => {
            fetchData();
        })
    }

    const handleRefresh = () => {
        setQuery('');
        setSearchParams({});
    }

    return (<>
        {
            data &&
            <Card>
                <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                    <Grid item xs={7}>
                        <Stack direction={"row"} spacing={1}>
                            <TextField id="outlined-basic" label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                            <Button variant="contained" color="primary" type="submit" onClick={handleSubmitQuery}>Tìm Kiếm</Button>
                            {
                                searchParams.get('query') &&
                                <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={5} container justifyContent={"flex-end"}>
                        <Stack direction={"row"} spacing={1}>
                            <CollectionSorter value={searchParams.get('status')}
                                title="Trạng thái"
                                defaultValue="Tất cả"
                                handleChange={status => {
                                    setSearchParams({
                                        ...Object.fromEntries(searchParams.entries()),
                                        status
                                    })
                                }}
                                options={CATEGORY_STATUS_OPTIONS}
                            />
                            <AddSoleDialog onSuccess={fetchData} />
                        </Stack>
                    </Grid>
                </Grid>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Tên Đế Giày</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.content && data.content.map((sole, index) => (
                                        <TableRow hover key={sole.id} tabIndex={-1}>
                                            <TableCell align="center" width={"10%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {index + 1 + data.size * data.number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {sole.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Chip label={sole.activeStatus.description} color={sole.activeStatus.color} />
                                            </TableCell>
                                            <TableCell align="center" width={"15%"}>
                                                <Stack direction="row" alignItems="center" justifyContent={"center"} spacing={2}>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton aria-label="edit" size="medium" color="primary" onClick={() => { setSole(sole) }}>
                                                            <Iconify icon="eva:edit-2-fill" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {
                                                        sole.activeStatus.name === 'ACTIVE' ?
                                                            <Tooltip title="Hủy kích hoạt">
                                                                <IconButton aria-label="inactive" size="medium" color="error" onClick={() => { handleUpdateStatus(sole.id, 'INACTIVE') }}>
                                                                    <Iconify icon="material-symbols:inactive-order-outline-rounded" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="Kích hoạt">
                                                                <IconButton aria-label="active" size="medium" color="warning" onClick={() => { handleUpdateStatus(sole.id, 'ACTIVE') }}>
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
                                to={`/dashboard/sole${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
                {
                    sole &&
                    <UpdateSoleDialog sole={sole} setSole={setSole} onSuccess={fetchData} />
                }
            </Card>
        }
    </>)
}

const CATEGORY_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'INACTIVE': { value: 'INACTIVE', label: 'Ngừng kích hoạt' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
}
