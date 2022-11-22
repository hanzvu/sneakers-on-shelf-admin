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
                <AnalyticEcommerce title="Danh Số Tháng Này" text={`${statisticData.monthlyCount} Đơn Hàng / ${fCurrency(statisticData.monthlyAmount)}`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <AnalyticEcommerce title="Hôm Nay" text={`${statisticData.dailyCount} Đơn Hàng / ${fCurrency(statisticData.dailyAmount)}`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <AnalyticEcommerce title="Hàng Bán Được Tháng Này" text={`${statisticData.monthlyProductQuantity} Chiếc`} />
            </Grid>
        </Grid>
    </>)
}