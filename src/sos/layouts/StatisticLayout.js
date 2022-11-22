import { Grid, Stack } from "@mui/material";
import BestSellingProduct from "../components/statistic/BestSellingProduct";
import OrderChart from "../components/statistic/OrderChart";
import OrderStatistic from "../components/statistic/OrderStatistic";
import OrderStatusPie from "../components/statistic/OrderStatusPie";

export default function StatisticLayout() {

    return (<>
        <Stack spacing={3}>
            <OrderStatistic />
            <OrderChart title="Đơn Hàng Trong Tháng" />
            <Grid container>
                <Grid item container spacing={3}>
                    <Grid item md={8}>
                        <BestSellingProduct />
                    </Grid>
                    <Grid item xs={4}>
                        <OrderStatusPie />
                    </Grid>
                </Grid>
            </Grid>
        </Stack>
    </>)
}