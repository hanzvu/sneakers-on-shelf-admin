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
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { showSnackbar } from "../../services/NotificationService";
import { findCategories, findCategory, saveCategory, deleteCategory } from "../../services/CategoryService";
import CollectionSorter from "../common/CollectionSorter";

// material

export default function CategoryList() {

    const [data, setData] = useState();

    const [query, setQuery] = useState('');

    const [category, setCategory] = useState({
        id: '',
        name: '',
        activeStatus: ''
    })

    const [searchParams, setSearchParams] = useSearchParams();
    const [checked, setChecked] = useState(false);
    const [openSave, setOpenSave] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        findCategories(Object.fromEntries(searchParams.entries())).then(data => {
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
            ...Object.fromEntries(searchParams.entries()),
            query
        })
    }

    const handleRefresh = () => {
        setQuery('');
        setSearchParams({});
    }

    const handleClose = () => {
        setOpenSave(false);
        setCategory(prevState => ({ ...prevState, id: '', name: '' }))
    };

    const handleSaveCategoryOnClick = () => {
        if (category.name.length == null || category.name.trimStart().trimEnd().length === 0) {
            showSnackbar("Bạn chưa nhập tên danh mục.", "warning");
            return;
        }

        handleSubmitCategory(category);
    }

    const handleSubmitCategory = (data) => {
        saveCategory(data).then(data => {
            setOpenSave(false);
            findCategories(Object.fromEntries(searchParams.entries())).then(data => {
                setData(data)
            });
            if (category.id === '') showSnackbar("Thêm mới thành công", "success");
            else showSnackbar("Cập nhật thành công", "success");
            setCategory(prevState => ({ ...prevState, id: '', name: '' }))
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
            setCategory(prevState => ({ ...prevState, activeStatus: 'ACTIVE' }))
        } else {
            setCategory(prevState => ({ ...prevState, activeStatus: 'INACTIVE' }))
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
                                <TextField id="outlined-basic" label="Tìm Danh Mục" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
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
                                    options={CATEGORY_STATUS_OPTIONS}
                                />

                                <Button variant="contained" onClick={() => { setOpenSave(true); setTitle("Thêm") }} startIcon={<Iconify icon="eva:plus-fill" />}>
                                    Thêm danh mục
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
                                    <TableCell align="center">Tên Danh Mục</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.content && data.content.map(Category => (
                                        <TableRow hover key={Category.id} tabIndex={-1}>
                                            <TableCell align="center" width={"10%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {Category.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Typography variant="body1" flexWrap>
                                                    {Category.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" width={"25%"}>
                                                <Chip label={Category.activeStatus.description} color={Category.activeStatus.color} />
                                            </TableCell>
                                            <TableCell align="center" width={"15%"}>
                                                <Stack direction="row" alignItems="center" justifyContent={"center"} spacing={2}>
                                                    <IconButton aria-label="edit" size="medium" color="primary"
                                                        onClick={() => {
                                                            setOpenSave(true);
                                                            setTitle("Sửa");
                                                            findCategory(Category.id).then(data => {
                                                                setCategory(prevState => ({ ...prevState, id: data.id, name: data.name, activeStatus: data.activeStatus.name }));
                                                                setChecked(data.activeStatus.name === "ACTIVE")
                                                            });
                                                        }}>
                                                        <Iconify icon="eva:edit-2-fill" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" size="medium" color="error" disabled={Category.activeStatus.name !== "ACTIVE"}
                                                        onClick={() => {
                                                            deleteCategory(Category.id).then(() => {
                                                                findCategories(Object.fromEntries(searchParams.entries())).then(data => {
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
                                                        }}>
                                                        <Iconify icon="eva:trash-fill" />
                                                    </IconButton>
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
                                to={`/dashboard/category${item.page === data.number + 1 ? '' : `?page=${item.page}`}`}
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
                        <TextField margin="normal" fullWidth id="outlined-basic" label="Nhập tên danh mục" variant="outlined" size="medium" value={category.name} onChange={e => { setCategory(prevState => ({ ...prevState, name: e.target.value })) }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleSaveCategoryOnClick} autoFocus>{title}</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        }
    </>)
}

const CATEGORY_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'INACTIVE': { value: 'INACTIVE', label: 'Ngừng kích hoạt' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kích hoạt' },
}
