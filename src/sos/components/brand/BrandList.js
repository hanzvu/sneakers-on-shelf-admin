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
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
    Chip,
    Switch,
    Tooltip,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { showSnackbar } from "../../services/NotificationService";
import { findBrands, findBrand, saveBrand, deleteBrand } from "../../services/BrandService";
import CollectionSorter from "../common/CollectionSorter";

// material

export default function BrandList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [brand, setBrand] = useState({
        id: '',
        name: '',
        activeStatus: ''
    })

    const [searchParams, setSearchParams] = useSearchParams();
    const [checked, setChecked] = useState(false);
    const [openSave, setOpenSave] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        findBrands(Object.fromEntries(searchParams.entries())).then(data => {
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

    const handleClose = () => {
        setOpenSave(false);
        setBrand(prevState => ({ ...prevState, id: '', name: '' }))
    };

    const handleSaveBrandOnClick = () => {
        if (brand.name == null) {
            showSnackbar("Tên nhãn hiệu không được phép trống.", "error");
            return;
        }
        if (brand.name.length == null || brand.name.trimStart().trimEnd().length === 0) {
            showSnackbar("Bạn chưa nhập tên nhãn hiệu.", "warning");
            return;
        }

        handleSubmitBrand(brand);
    }

    const handleChangeBrandStatus = (id) => {
        deleteBrand(id).then(() => {
            findBrands(Object.fromEntries(searchParams.entries())).then(data => {
                setData(data)
            });
            showSnackbar("Đã ngừng kích hoạt", "success");
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    const handleSubmitBrand = (data) => {
        saveBrand(data).then(data => {
            setOpenSave(false);
            findBrands(Object.fromEntries(searchParams.entries())).then(data => {
                setData(data)
            });
            if (brand.id === '') showSnackbar("Thêm mới thành công", "success");
            else showSnackbar("Cập nhật thành công", "success");
            setBrand(prevState => ({ ...prevState, id: '', name: '' }))
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    const handleSatustChange = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked === true) {
            setBrand(prevState => ({ ...prevState, activeStatus: 'ACTIVE' }))
        } else {
            setBrand(prevState => ({ ...prevState, activeStatus: 'INACTIVE' }))
        }

    };
    return (<>
        {
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item xs={7}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Nhãn Hiệu" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
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
                                    options={BRAND_STATUS_OPTIONS}
                                />

                                <Button variant="contained" onClick={() => { setOpenSave(true); setTitle("Thêm") }} startIcon={<Iconify icon="eva:plus-fill" />}>
                                    Thêm nhãn hiệu
                                </Button>
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
                                    <TableCell align="center">Tên Nhãn Hiệu</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.content && data.content.map(brand => (
                                        <TableRow hover key={brand.id} tabIndex={-1}>
                                            <TableCell align="center" width={"10%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {brand.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {brand.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Chip label={brand.activeStatus.description} color={brand.activeStatus.color} />
                                            </TableCell>
                                            <TableCell align="center" width={"15%"}>
                                                <Stack direction="row" alignItems="center" justifyContent={"center"} spacing={2}>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton aria-label="edit" size="medium" color="primary"
                                                            onClick={() => {
                                                                setOpenSave(true);
                                                                setTitle("Sửa");
                                                                findBrand(brand.id).then(data => {
                                                                    setBrand(prevState => ({ ...prevState, id: data.id, name: data.name, activeStatus: data.activeStatus.name }));
                                                                    setChecked(data.activeStatus.name === "ACTIVE")
                                                                });
                                                            }}>
                                                            <Iconify icon="eva:edit-2-fill" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Hủy kích hoạt">
                                                        <IconButton disabled={brand.activeStatus.name !== 'ACTIVE'} aria-label="inactive" size="medium" color="error" onClick={() => { handleChangeBrandStatus(brand.id) }}>
                                                            <Iconify icon="material-symbols:inactive-order-outline-rounded" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                {
                                    data.content && data.content.length === 0 &&
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
                                to={`/dashboard/brand${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>

                <Dialog open={openSave} onClose={handleClose} fullWidth>
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        {
                            title.match("Sửa") &&
                            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                <Typography variant="button">Trạng thái: </Typography>
                                <Switch checked={checked} onChange={handleSatustChange} inputProps={{ 'aria-label': 'controlled' }} color="success" />
                                {
                                    checked ? <Typography variant="caption">Kích hoạt</Typography> : <Typography variant="caption">Ngừng kích hoạt</Typography>
                                }
                            </Stack>
                        }
                        <TextField margin="normal" fullWidth id="outlined-basic" label="Nhập tên nhãn hiệu" variant="outlined" size="medium" value={brand.name} onChange={e => { setBrand(prevState => ({ ...prevState, name: e.target.value })) }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleSaveBrandOnClick} autoFocus>{title}</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        }
    </>)
}

const BRAND_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'INACTIVE': { value: 'INACTIVE', label: 'Ngừng kích hoạt' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
}