import OrderChart from "../components/statistic/OrderChart";
import OrderStatistic from "../components/statistic/OrderStatistic";

export default function StatisticLayout() {

    return (<>
        <OrderStatistic />
        <OrderChart title="Đơn Hàng Trong Tháng" />
    </>)
}