import { Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { fCurrency } from '../../../utils/formatNumber';

export default function OrderItem({ orderItem, component }) {

    const { id, quantity, productId, name, size, image, price, rate } = orderItem;

    return (<>
        <Grid container className="border-bottom">
            <Grid container item lg={8} spacing={3}>
                <Grid item lg={4} xs={4}>
                    <Link to={`/products/${productId}`}><img src={image} className="img-fluid" alt="product" /></Link>
                </Grid>
                <Grid item xs={8} container alignItems={"center"}>
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
                        <Typography variant='body2' color={"dimgray"}>
                            x {quantity}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container item lg={4} spacing={1} justifyContent={"space-around"} alignItems="center">
                <Typography variant='body1' color={"crimson"}>
                    {fCurrency(price * quantity)}
                </Typography>
                {component}
            </Grid>
        </Grid>
    </>)
}