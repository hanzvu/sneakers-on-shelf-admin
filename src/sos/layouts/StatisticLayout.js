import { Stack } from "@mui/material";
import OrderChart from "../components/statistic/OrderChart";
import OrderStatistic from "../components/statistic/OrderStatistic";

export default function StatisticLayout() {

    return (<>
        <Stack spacing={3}>
            <OrderStatistic />
            <OrderChart title="Đơn Hàng Trong Tháng" />
        </Stack>
    </>)
}