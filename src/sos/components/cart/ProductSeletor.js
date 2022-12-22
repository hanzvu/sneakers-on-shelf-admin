import { useState, useEffect, forwardRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Grid, Link, Pagination, PaginationItem, Slide, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Scrollbar from "../../../components/Scrollbar";
import { showSnackbar } from "../../services/NotificationService";
import { findProduct, findProducts } from "../../services/ProductService";
import { fCurrency } from "../../../utils/formatNumber";
import ProductDetailSeletor from "./ProductDetailSeletor";
import CollectionSorter from "../common/CollectionSorter";
import CollectionColorSorter from "../common/CollectionColorSorter";
import { getAllBrand, getAllCategory, getAllColor, getAllMaterial, getAllSole } from "../../services/CollectionService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductSeletor({ handleSelectProductDetail }) {

    const [open, setOpen] = useState(false);

    const [product, setProduct] = useState(null);

    const [query, setQuery] = useState('');

    const [params, setParams] = useState({});

    const [data, setData] = useState({ content: [] });

    const [sorter, setSorter] = useState();

    useEffect(() => {
        fetchSorter();
    }, [])

    useEffect(() => {
        findProducts({ ...params, status: 'ACTIVE' }).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }, [params]);

    const handleSearchProduct = () => {
        if (query.trimStart().trimEnd().length > 0) {
            setParams({ ...params, query });
        }
    }

    const handleChangePage = (event, page) => {
        setParams({ ...params, page })
    }

    const handleSelectProduct = id => {
        findProduct(id).then(product => {
            setProduct(product);
        })
    }

    const handleSelectedProductDetail = data => {
        setProduct(null);
        setOpen(false);
        setData({ content: [] })
        handleSelectProductDetail(data);
    }

    const fetchSorter = async () => {
        const brands = await getAllBrand();
        const categories = await getAllCategory();
        const colors = await getAllColor();
        const soles = await getAllSole();
        const materials = await getAllMaterial();
        setSorter({ ...sorter, brands: convertToSorterData(brands), categories: convertToSorterData(categories), soles: convertToSorterData(soles), materials: convertToSorterData(materials), colors: convertToColorSorterData(colors) })
    }

    const convertToSorterData = source => {
        const rs = source.reduce((obj, row) => {
            obj[row.id] = {
                value: row.id,
                label: row.name
            };
            return obj;
        }, {});

        return {
            '': { value: '', label: 'Tất cả' },
            ...rs
        }
    }

    const convertToColorSorterData = source => {
        const rs = source.reduce((obj, row) => {
            obj[row.id] = {
                value: row.id,
                code: row.code
            };
            return obj;
        }, {});

        return {
            '': { value: '', label: 'Tất cả' },
            ...rs
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                THÊM SẢN PHẨM
            </Button>
            <Dialog
                maxWidth={"lg"}
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Tìm Kiếm Sản Phẩm</DialogTitle>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Grid container spacing={3} pt={1}>
                        <Grid item xs={7}>
                            <TextField autoFocus fullWidth label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                        </Grid>
                        <Grid item container xs={5}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" onClick={handleSearchProduct}>Tìm Kiếm</Button>
                                <Button variant="contained" color="warning" onClick={() => { setParams({}) }}>Làm Mới</Button>
                            </Stack>

                        </Grid>
                        <Grid item container justifyContent={"center"}>
                            <Stack spacing={2} justifyContent={"center"} alignItems="center">
                                <Stack direction={"row"} justifyContent={"center"} alignItems="center" spacing={2}>
                                    {
                                        sorter && <>
                                            <CollectionSorter value={params.category}
                                                title="Danh Mục"
                                                defaultValue="Tất cả"
                                                handleChange={category => {
                                                    setParams({ ...params, category });
                                                }}
                                                options={sorter.categories}
                                            />
                                            <CollectionSorter value={params.brand}
                                                title="Hãng"
                                                defaultValue="Tất cả"
                                                handleChange={brand => {
                                                    setParams({ ...params, brand });
                                                }}
                                                options={sorter.brands}
                                            />
                                            <CollectionSorter value={params.material}
                                                title="Chất Liệu"
                                                defaultValue="Tất cả"
                                                handleChange={material => {
                                                    setParams({ ...params, material });
                                                }}
                                                options={sorter.materials}
                                            />
                                            <CollectionSorter value={null}
                                                title="Đế Giày"
                                                defaultValue="Tất cả"
                                                handleChange={sole => {
                                                    setParams({ ...params, sole });
                                                }}
                                                options={sorter.soles}
                                            />
                                            <CollectionColorSorter value={params.color}
                                                title="Màu Sắc"
                                                defaultValue="Tất cả"
                                                handleChange={color => {
                                                    setParams({ ...params, color });
                                                }}
                                                options={sorter.colors}
                                            />
                                        </>
                                    }
                                </Stack>
                                <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                                    <CollectionSorter value={params.gender}
                                        title="Giới tính"
                                        defaultValue="Tất cả"
                                        handleChange={gender => {
                                            setParams({ ...params, gender });
                                        }}
                                        options={PRODUCT_GENDER_OPTIONS}
                                    />
                                    <CollectionSorter value={params.sort}
                                        title="Sắp xếp"
                                        defaultValue="Mặc định"
                                        handleChange={sort => {
                                            setParams({ ...params, sort });
                                        }}
                                        options={PRODUCT_SORTER_OPTIONS}
                                    />
                                </Stack>

                            </Stack>

                        </Grid>
                    </Grid>

                    <Scrollbar>
                        <TableContainer sx={{ minHeight: 400 }} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Ảnh</TableCell>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Tên Sản Phẩm</TableCell>
                                        <TableCell align="center">Giá</TableCell>
                                        <TableCell align="center">Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        data.content && data.content.map(product => (
                                            <TableRow hover key={product.id} tabIndex={-1}>
                                                <TableCell align="center" width={"20%"}>
                                                    <img src={product.image} className="img-fluid" alt='product' />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {product.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {product.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {fCurrency(product.sellPrice)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button variant="outlined" color="primary" onClick={() => { handleSelectProduct(product.id) }}>Chọn</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            data.totalPages &&
                            <Stack alignItems={"center"} spacing={3} py={2}>
                                <Pagination count={data.totalPages} page={data.number + 1} siblingCount={0} onChange={handleChangePage} />
                            </Stack>
                        }
                    </Scrollbar>
                </DialogContent>
            </Dialog>
            <ProductDetailSeletor product={product} setProduct={setProduct} handleSelectProductDetail={handleSelectedProductDetail} />
        </>
    )
}

const PRODUCT_GENDER_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'MEN': { value: 'MEN', label: 'Nam' },
    'WOMAN': { value: 'WOMAN', label: 'Nữ' },
    'UNISEX': { value: 'UNISEX', label: 'Unisex' },
}

const PRODUCT_SORTER_OPTIONS = {
    '': { value: '', label: 'Mặc định' },
    'date_desc': { value: 'date_desc', label: 'Hàng mới nhất' },
    'price_asc': { value: 'price_asc', label: 'Giá tăng dần' },
    'price_desc': { value: 'price_desc', label: 'Giá giảm dần' },
    'name_asc': { value: 'name_asc', label: 'A -> Z' },
    'name_desc': { value: 'name_desc', label: 'Z -> A' },
}