import { useState, useEffect } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { BaseOptionChart } from '../../../components/chart';
import { getOrderChartStatisticData } from '../../services/StatisticService';

export default function OrderChart({ title, subheader, ...other }) {

    const [chartData, setChartData] = useState(() => ({ series: [], labels: [] }));

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOrderChartStatisticData();

            const labelsArr = [];
            const countArr = [];
            const amountArr = [];
            const productCountArr = [];

            data.forEach(element => {
                labelsArr.push(element.date);
                countArr.push(element.count);
                amountArr.push(element.amount);
                productCountArr.push(element.productCount);
            });

            const seriesArr = [
                {
                    name: 'Số Đơn Hàng',
                    type: 'column',
                    fill: 'solid',
                    data: countArr,
                },
                {
                    name: 'Số Sản Phẩm',
                    type: 'area',
                    fill: 'gradient',
                    data: productCountArr,
                }
            ];

            setChartData({ labels: labelsArr, series: seriesArr })
        }

        fetchData();
    }, []);

    const chartOptions = merge(BaseOptionChart(), {
        plotOptions: { bar: { columnWidth: '16%' } },
        fill: { type: chartData.series.map((i) => i.fill) },
        labels: chartData.labels,
        xaxis: { type: 'datetime' },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(0)} visits`;
                    }
                    return y;
                },
            },
        },
    });

    return (<>
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart type="line" series={chartData.series} options={chartOptions} height={364} />
            </Box>
        </Card>
    </>)
}