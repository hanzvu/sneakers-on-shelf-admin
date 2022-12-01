import { useState, forwardRef } from "react";
import { Box, Button, Container, Dialog, DialogContent, Grid, Slide, Stack, Typography } from "@mui/material";
import CartIncrementer from "../cart/CartIncrementer";
import { createProductDetail } from "../../services/ProductDetailService";
import { showSnackbar } from "../../services/NotificationService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateProductSize({ id, fetchData }) {

    const [open, setOpen] = useState(false);

    const [size, setSize] = useState(40);

    const [quantity, setQuantity] = useState(1);

    const handleSelectSize = size => {
        setSize(size);
    }

    const handleSubmit = () => {
        if (quantity < 0) {
            showSnackbar('Số lượng không hợp lệ.', 'error')
            return;
        }
        createProductDetail(id, {
            size,
            quantity
        }).then(() => {
            fetchData();
            setOpen(false);
            setQuantity(1);
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    return (<>
        <Button variant="contained" onClick={() => { setOpen(true) }}>
            Thêm Kích Cỡ
        </Button>
        <Dialog
            maxWidth={"sm"}
            fullWidth
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { setOpen(false) }}
            aria-describedby="alert-dialog-slide-description">
            <DialogContent sx={{ zIndex: 'modal' }}>
                <Stack spacing={4}>
                    <Grid container>
                        <Grid container item xs={3} alignItems="center">
                            <Typography>
                                Kích Cỡ
                            </Typography>
                        </Grid>
                        <Grid container item xs={9}>
                            <Container disableGutters>
                                <Grid container spacing={1}>
                                    <ProductSizeButton size={34} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={35} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={36} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={37} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={38} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={39} selected={size} handleClick={handleSelectSize} />
                                </Grid>
                            </Container>
                            <Container disableGutters>
                                <Grid container spacing={1} pt={1}>
                                    <ProductSizeButton size={40} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={41} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={42} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={43} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={44} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={45} selected={size} handleClick={handleSelectSize} />
                                </Grid>
                            </Container>
                            <Container disableGutters>
                                <Grid container spacing={1} pt={1}>
                                    <ProductSizeButton size={46} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={47} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={48} selected={size} handleClick={handleSelectSize} />
                                    <ProductSizeButton size={49} selected={size} handleClick={handleSelectSize} />
                                </Grid>
                            </Container>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3}>
                            Số Lượng
                        </Grid>
                        <Grid item xs={9}>
                            <Stack direction={"row"}>
                                <CartIncrementer
                                    name="quantity"
                                    quantity={quantity}
                                    onBlurHandler={value => setQuantity(value)}
                                    onIncrementQuantity={() => setQuantity(quantity + 1)}
                                    onDecrementQuantity={() => setQuantity(quantity - 1)} />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent={"center"}>
                        <Button variant="contained" onClick={handleSubmit}>Xác Nhận</Button>
                    </Grid>
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}

const ProductSizeButton = ({ size, selected, handleClick }) => {
    return (<>
        <Grid item xs={2}>
            <Button sx={{ borderRadius: '0' }} color="primary" variant={Number(size) === Number(selected) ? 'contained' : 'outlined'} onClick={() => { handleClick(size) }}>
                {size}
            </Button>
        </Grid>
    </>)
}