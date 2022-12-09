import { Box, Button, Dialog, DialogContent, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartIncrementer from '../cart/CartIncrementer';
import { reverseOrderItem } from '../../services/OrderService';
import { fCurrency } from '../../../utils/formatNumber';
import { showSnackbar } from '../../services/NotificationService';

export default function ConfirmReverseOrderItem({ data, setData, onReverseSuccess }) {

    const [changing, setChanging] = useState({
        quantity: 1,
        surchange: 0,
        description: ''
    });

    const onSubmit = () => {
        if (changing.quantity > data.reverseOrderItem.quantity || changing.quantity < 1) {
            showSnackbar('Số lượng không hợp lệ.', "error");
            return;
        }

        if (changing.description.trim().length === 0) {
            showSnackbar('Bạn chưa nhập mô tả.', "error");
            return;
        }

        const surchange = changing.surchange ? Number(changing.surchange) : 0;

        if (surchange < 0 || surchange > data.reverseOrderItem.price * changing.quantity) {
            showSnackbar('Phụ phí không hợp lệ.', "error");
            return;
        }

        reverseOrderItem(data.reverseOrderItem.id, { ...changing, surchange }).then(() => {
            onReverseSuccess();
            setData({ ...data, reverseOrderItem: null });
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
                open={data.reverseOrderItem != null}
                keepMounted
                onClose={() => { setData({ ...data, reverseOrderItem: null }) }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ zIndex: 'modal' }}>
                    {
                        data.reverseOrderItem &&
                        <Stack>
                            <Typography variant='h4' py={1} color={"dimgray"} textAlign={"center"} className="border-bottom">
                                XÁC NHẬN TRẢ HÀNG
                            </Typography>
                            <Grid py={3} container className="border-bottom">
                                <Grid container item lg={8} spacing={2}>
                                    <Grid item lg={4} xs={4}>
                                        <Link to={`/products/${data.reverseOrderItem.productId}`}><img src={data.reverseOrderItem.image} className="img-fluid" alt="product" /></Link>
                                    </Grid>
                                    <Grid item xs={8} container alignItems={"center"}>
                                        <Stack spacing={1}>
                                            <Typography variant='h5'>
                                                {data.reverseOrderItem.name}
                                            </Typography>
                                            <Typography variant='body2' color={"crimson"}>
                                                {fCurrency(data.reverseOrderItem.price)}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                Size : {data.reverseOrderItem.size}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                x {data.reverseOrderItem.quantity}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid container item lg={4} justifyContent={"space-around"} alignItems="center">
                                    <Typography variant='body1' color={"crimson"}>
                                        {fCurrency(data.reverseOrderItem.price * data.reverseOrderItem.quantity)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent={"center"}>
                                <Grid item xs={4} container alignItems={"flex-end"}>
                                    <Stack alignItems={"center"} direction="row" py={2} spacing={3}>
                                        <Typography variant='body2' color={"dimgray"}>
                                            Số lượng & Phụ phí :
                                        </Typography>
                                        <CartIncrementer
                                            name="quantity"
                                            quantity={changing.quantity}
                                            onBlurHandler={quantity => { setChanging({ ...changing, quantity }) }}
                                            onIncrementQuantity={() => { if (changing.quantity < data.reverseOrderItem.quantity) setChanging({ ...changing, quantity: changing.quantity + 1 }) }}
                                            onDecrementQuantity={() => { if (changing.quantity > 1) { setChanging({ ...changing, quantity: changing.quantity - 1 }) } }} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={3} container alignItems={"flex-end"}>
                                    <Stack alignItems={"center"} py={2}>
                                        <TextField size='small' value={changing.surchange} onChange={e => { setChanging({ ...changing, surchange: e.target.value }) }} variant="outlined" label="Phụ phí" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1 }} />
                                    </Stack>
                                </Grid>
                            </Grid>
                            <TextField label="Mô tả" multiline minRows={2} value={changing.description} onChange={(e) => { setChanging({ ...changing, description: e.target.value }) }} />
                            <Stack alignItems={"flex-end"} pt={2}>
                                <Box>
                                    <Button variant='outlined' color='error' size='large' onClick={onSubmit}>
                                        Trả Hàng
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