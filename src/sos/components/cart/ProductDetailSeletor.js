import { forwardRef } from "react";
import { Dialog, DialogContent, Grid, Slide, Typography } from "@mui/material";
import { fCurrency } from "../../../utils/formatNumber";
import ProductDetailSizeList from "./ProductDetailSizeList";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductDetailSeletor({ product, setProduct, handleSelectProductDetail }) {

    if (product == null) {
        return;
    }

    console.log(product);

    return (
        <>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={product != null}
                onClose={() => { setProduct(null) }}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description">
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Grid container item spacing={5} pt={3}>
                        <Grid container item md={6}>
                            <img alt="la" src={product.productImage.image} />
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant='h4'>
                                {product.name}
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item container spacing={2}>
                                    <Grid item xs={5}>
                                        <Typography variant="body2">
                                            Thương hiệu
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography variant="subtitle2">
                                            {product.brand.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={5}>
                                        <Typography variant="body2">
                                            Danh mục
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography variant="subtitle2">
                                            {product.category.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={5}>
                                        <Typography variant="body2">
                                            Dành cho
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography variant="subtitle2">
                                            {product.productGender.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <div className="py-3">
                                <h5 className="h4 text-danger m-0 fw-bold">{fCurrency(product.sellPrice)}</h5>
                            </div>

                            <ProductDetailSizeList productDetails={product.productDetails} handleSelectProductDetail={handleSelectProductDetail} />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}