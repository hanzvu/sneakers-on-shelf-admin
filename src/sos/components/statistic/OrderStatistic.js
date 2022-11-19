import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { getOrderStatistic } from "../../services/StatisticService";
import AnalyticEcommerce from "./AnalyticEcommerce";
import { fCurrency } from "../../../utils/formatNumber";

export default function OrderStatistic() {

    const [statisticData, setStatisticData] = useState();

    useEffect(() => {
        getOrderStatistic().then(data => {
            setStatisticData(data);
        })
    }, [])

    if (statisticData == null) {
        return;
    }

    return (<>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <AnalyticEcommerce title="Danh Số Tháng Này" text={`${statisticData.monthlyOrderCount} Đơn Hàng / ${fCurrency(statisticData.monthlyOrderAmount)}`} extra={`Tổng số sản phẩm : ${statisticData.monthlyProductCount}`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <AnalyticEcommerce title="Hôm Nay" text={`${statisticData.dailyOrderCount} Đơn Hàng / ${fCurrency(statisticData.dailyOrderAmount)}`} extra={`Tổng số sản phẩm : ${statisticData.dailyProductCount}`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <AnalyticEcommerce title="Hủy Đơn Tháng Này" text={`${statisticData.monthlyCancelledOrderCount} / ${statisticData.monthlyTotalOrderCount} Đơn Hàng`} percentage={statisticData.monthlyTotalOrderCount !== 0 ? statisticData.monthlyCancelledOrderCount / statisticData.monthlyTotalOrderCount * 100 : 0} color={"error"} extra={`Tổng số sản phẩm : ${statisticData.monthlyCancelledProductCount}`} />
            </Grid>
        </Grid>
    </>)
}