import { useState, forwardRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Grid, Link, Pagination, PaginationItem, Slide, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Scrollbar from "../../../components/Scrollbar";
import { showSnackbar } from "../../services/NotificationService";
import { findProduct, findProducts } from "../../services/ProductService";
import { fCurrency } from "../../../utils/formatNumber";
import ProductDetailSeletor from "./ProductDetailSeletor";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductSeletor({ handleSelectProductDetail }) {

    const [open, setOpen] = useState(false);

    const [product, setProduct] = useState(null)

    const [query, setQuery] = useState('');

    const [data, setData] = useState({ content: [] });

    const handleSearchProduct = () => {
        const params = query.trimStart().trimEnd().length > 0 ? { query } : {};
        findProducts(params).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    const handleChangePage = (event, page) => {
        const params = query.trimStart().trimEnd().length > 0 ? { query } : {};
        findProducts({ ...params, page }).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
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
                maxWidth={"md"}
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
                            <Button variant="contained" onClick={handleSearchProduct}>Tìm Kiếm</Button>
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