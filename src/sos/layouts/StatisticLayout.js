import OrderChart from "../components/statistic/OrderChart";
import OrderStatistic from "../components/statistic/OrderStatistic";

export default function StatisticLayout() {

    return (<>
        <OrderStatistic />
        <OrderChart title="Website Visits"
            subheader="(+43%) than last year"
        />
    </>)
}