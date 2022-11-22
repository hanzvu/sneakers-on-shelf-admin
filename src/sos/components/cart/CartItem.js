import { Link } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import { removeFromCart, setCartItemQuantity } from '../../services/CartService';
import { fCurrency } from '../../../utils/formatNumber';
import CartIncrementer from './CartIncrementer';
import { showSnackbar } from '../../services/NotificationService';

export default function CartItem({ item, onSuccess }) {

    const { id, quantity, productId, name, size, image, price } = item;

    const handleRemoveCart = id => {
        removeFromCart(id).then(() => {
            onSuccess();
        }).catch(error => {
            if (error.response != null && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        });
    }

    const handleChangeQuantity = value => {
        if (value < 1) {
            return;
        }
        setCartItemQuantity(id, value).then(() => {
            onSuccess();
        }).catch(error => {
            if (error.response != null && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        });
    }

    return (<>
        <Grid container spacing={1} className={"border-bottom"}>
            <Grid item container lg={7} spacing={3}>
                <Grid item lg={4} xs={12}>
                    <Link to={`/products/${productId}`}><img src={image} className="img-fluid" alt='product' /></Link>
                </Grid>
                <Grid item container lg={8} xs={12} justifyContent={"space-around"} direction={"column"}>
                    <Stack spacing={1}>
                        <Typography variant='h5'>
                            {name}
                        </Typography>
                        <Typography variant='body2' color={"crimson"}>
                            {fCurrency(price)}
                        </Typography>
                        <Typography variant='body2' color={"dimgray"}>
                            Size : {size}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Grid item lg={5} container spacing={2}>
                <Grid item container md={4} xs={6} justifyContent="center" alignItems="center">
                    <CartIncrementer
                        name="quantity"
                        quantity={quantity}
                        onBlurHandler={value => handleChangeQuantity(value)}
                        onIncrementQuantity={() => handleChangeQuantity(quantity + 1)}
                        onDecrementQuantity={() => handleChangeQuantity(quantity - 1)} />
                </Grid>
                <Grid item container md={4} xs={6} justifyContent="center" alignItems="center">
                    <p className="m-0 text-danger text-center">{fCurrency(quantity * price)}</p>
                </Grid>
                <Grid item container md={4} xs={12} justifyContent="center" alignItems="center">
                    <button type="button" className="btn btn-danger shadow-none" onClick={() => handleRemoveCart(id)}>
                        Xóa Khỏi Giỏ</button>
                </Grid>
            </Grid>
        </Grid>
    </>)
}