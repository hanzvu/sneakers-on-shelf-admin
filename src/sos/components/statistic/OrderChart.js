import { useState, useEffect } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { BaseOptionChart } from '../../../components/chart';
import { getOrderChartStatisticData } from '../../services/StatisticService';
import getDaysInMonth from '../common/DateUtils';

export default function OrderChart({ title, subheader, ...other }) {

    const [chartData, setChartData] = useState(() => ({ series: [], labels: [] }));

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderChartStatisticData();

            const data = response.reduce((obj, row) => {
                obj[row.date] = row;
                return obj
            }, {});

            const labelsArr = getDaysInMonth(new Date()).map(date => date.getDate());
            const countArr = [];
            const amountArr = [];

            labelsArr.forEach(date => {
                if (data[date] != null) {
                    countArr.push(data[date].count);
                    amountArr.push(data[date].amount);
                    return;
                }
                countArr.push(0);
                amountArr.push(0);

            });
            const seriesArr = [
                {
                    name: 'Số Đơn Hàng',
                    data: countArr,
                }
            ];
            setChartData({ labels: labelsArr, series: seriesArr })
        }


        fetchData();
    }, []);

    const chartOptions = merge(BaseOptionChart(), {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: chartData.labels,
        },
        yaxis: {
            allowDecimals: false,
            title: {
                text: 'Số đơn'
            },
            labels: {
                formatter: val => {
                    return val.toFixed(0)
                }
            },
        },
        fill: {
            opacity: 1
        },
    });

    return (<>
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            {
                chartData.labels.length !== 0 &&
                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                    <ReactApexChart type="bar" series={chartData.series} options={chartOptions} height={364} />
                </Box>
            }
        </Card>

    </>)
}