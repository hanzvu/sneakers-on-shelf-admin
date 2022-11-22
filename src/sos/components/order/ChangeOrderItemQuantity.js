import { Box, Button, Dialog, DialogContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIncrementer from '../cart/CartIncrementer';
import { updateOrderItemQuantity } from '../../services/OrderService';
import { fCurrency } from '../../../utils/formatNumber';
import { showSnackbar } from '../../services/NotificationService';

export default function ChangeOrderItemQuantity({ data, setData, onChangeProductQuantitySuccess }) {

    const [changing, setChanging] = useState({
        quantity: data.changingProductQuantity ? data.changingProductQuantity.quantity : 0,
        description: ''
    });

    const onSubmit = () => {
        updateOrderItemQuantity(data.changingProductQuantity.id, changing).then(() => {
            onChangeProductQuantitySuccess();
            setData({ ...data, changingProductQuantity: null });
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    return (
        <>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={data.changingProductQuantity != null}
                keepMounted
                onClose={() => { setData({ ...data, changingProductQuantity: null }) }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ zIndex: 'modal' }}>
                    {
                        data.changingProductQuantity &&
                        <Stack>
                            <Grid py={3} container className="border-bottom">
                                <Grid container item lg={8}>
                                    <Grid item lg={3} xs={4}>
                                        <Link to={`/products/${data.changingProductQuantity.productId}`}><img src={data.changingProductQuantity.image} className="img-fluid" alt="product" /></Link>
                                    </Grid>
                                    <Grid item xs={8} container alignItems={"center"}>
                                        <Stack spacing={1}>
                                            <Typography variant='h5'>
                                                {data.changingProductQuantity.name}
                                            </Typography>
                                            <Typography variant='body2' color={"crimson"}>
                                                {fCurrency(data.changingProductQuantity.price)}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                Size : {data.changingProductQuantity.size}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                x {data.changingProductQuantity.quantity}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid container item lg={4} justifyContent={"space-around"} alignItems="center">
                                    <Typography variant='body1' color={"crimson"}>
                                        {fCurrency(data.changingProductQuantity.price * data.changingProductQuantity.quantity)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Stack alignItems={"center"} py={2}>
                                <Typography variant='body2' color={"dimgray"}>
                                    Số lượng
                                </Typography>
                                <CartIncrementer
                                    name="quantity"
                                    quantity={changing.quantity}
                                    onBlurHandler={quantity => { setChanging({ ...changing, quantity }) }}
                                    onIncrementQuantity={() => { setChanging({ ...changing, quantity: changing.quantity + 1 }) }}
                                    onDecrementQuantity={() => { if (changing.quantity > 1) { setChanging({ ...changing, quantity: changing.quantity - 1 }) } }} />
                            </Stack>
                            <TextField label="Mô tả" multiline minRows={4} value={changing.description} onChange={(e) => { setChanging({ ...changing, description: e.target.value }) }} />
                            <Stack alignItems={"flex-end"} pt={2}>
                                <Box>
                                    <Button variant='outlined' color='secondary' size='large' onClick={onSubmit}>
                                        Cập Nhật
                                    </Button>
                                </Box>
                            </Stack>
                        </Stack>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}