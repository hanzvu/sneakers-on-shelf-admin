import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Stack, TextField, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// components
import { getOrderChartStatisticData } from '../../services/StatisticService';
import { getAllDaysInRange, getDaysInMonth } from '../common/DateUtils';

export default function OrderChart({ dates, setDates, ...other }) {

    const [chartData, setChartData] = useState(() => ({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
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
                categories: [],
            },
            yaxis: {
                title: {
                    text: ''
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: val => (val)
                }
            }
        },
    }));

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderChartStatisticData(dates);

            const data = response.reduce((obj, row) => {
                obj[row.date] = row;
                return obj
            }, {});

            const labelsArr = getAllDaysInRange(dates).map(date => date.toLocaleDateString());
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
            setChartData({
                options: {
                    ...chartData.options,
                    xaxis: {
                        ...chartData.options.xaxis,
                        categories: labelsArr,
                        tickAmount: 30
                    }
                },
                series: seriesArr
            })
        }


        fetchData();
    }, [dates]);

    return (<>
        <Card {...other}>
            <CardHeader title={"Biểu Đồ Thống Kê"} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack p={3} spacing={3} direction="row">
                    <DatePicker
                        label="Từ ngày"
                        inputFormat='DD/MM/YYYY'
                        value={dates.fromDate}
                        onChange={(newValue) => {
                            setDates({ ...dates, fromDate: newValue.$d });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="Đến ngày"
                        inputFormat='DD/MM/YYYY'
                        value={dates.toDate}
                        onChange={(newValue) => {
                            setDates({ ...dates, toDate: newValue.$d });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
            </LocalizationProvider>
            {
                chartData.options.xaxis.categories.length !== 0 &&
                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                    <ReactApexChart type="bar" series={chartData.series} options={chartData.options} height={364} />
                </Box>
            }
        </Card>

    </>)
}