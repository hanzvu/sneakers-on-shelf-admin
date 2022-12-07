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
    Checkbox,
    Container,
} from "@mui/material";
import Favorite from '@mui/icons-material/Favorite';
import SquareIcon from '@mui/icons-material/Square';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IconButton from '@mui/material/IconButton';
import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { showSnackbar } from "../../services/NotificationService";
import CollectionSorter from "../common/CollectionSorter";
import { findColors, updateColorStatus } from "../../services/ColorService";
import AddColorDialog from "./AddColorDialog";
import UpdateColorDialog from "./UpdateColorDialog";


// material

export default function ColorList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [color, setColor] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const fetchData = () => {
        findColors(Object.fromEntries(searchParams.entries())).then(data => { setData(data) })
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
        updateColorStatus(id, status).then(() => {
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
                            <TextField id="outlined-basic" label="Tìm Danh Mục" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
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
                            <AddColorDialog onSuccess={fetchData} />
                        </Stack>
                    </Grid>
                </Grid>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Mã</TableCell>
                                    <TableCell align="center">Màu</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.content && data.content.map(color => (
                                        <TableRow hover key={color.id} tabIndex={-1}>
                                            <TableCell align="center" width={"10%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {color.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {color.code}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <SquareIcon style={{ fill: color.code }} />
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Chip label={color.activeStatus.description} color={color.activeStatus.color} />
                                            </TableCell>
                                            <TableCell align="center" width={"15%"}>
                                                <Stack direction="row" alignItems="center" justifyContent={"center"} spacing={2}>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton aria-label="edit" size="medium" color="primary" onClick={() => { setColor(color) }}>
                                                            <Iconify icon="eva:edit-2-fill" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {
                                                        color.activeStatus.name === 'ACTIVE' ?
                                                            <Tooltip title="Hủy kích hoạt">
                                                                <IconButton aria-label="inactive" size="medium" color="error" onClick={() => { handleUpdateStatus(color.id, 'INACTIVE') }}>
                                                                    <Iconify icon="material-symbols:inactive-order-outline-rounded" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="Kích hoạt">
                                                                <IconButton aria-label="active" size="medium" color="warning" onClick={() => { handleUpdateStatus(color.id, 'ACTIVE') }}>
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
                                to={`/dashboard/material${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
                <Checkbox icon={<SquareIcon style={{ fill: "#b72e2e" }} />} checkedIcon={<CheckBoxIcon style={{ fill: "#b72e2e" }} />} readOnly />
                {
                    color &&
                    <UpdateColorDialog color={color} setColor={setColor} onSuccess={fetchData} />
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
