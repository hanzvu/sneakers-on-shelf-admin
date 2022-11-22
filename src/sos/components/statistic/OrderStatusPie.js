import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, styled, useTheme } from '@mui/material';
import { getOrderStatusStatisticProjections } from '../../services/StatisticService';
// components

export default function OrderStatusPie() {

    const theme = useTheme()

    const [data, setData] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrderStatusStatisticProjections();

            const labels = [];
            const series = [];

            response.forEach(element => {
                labels.push(element.orderStatus.description);
                series.push(element.count);
            });

            setData({
                series,
                options: {
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels,
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    legend: {
                        position: 'bottom'
                    },
                    colors: [
                        theme.palette.primary.main,
                        theme.palette.error.main,
                        theme.palette.warning.main,
                        theme.palette.success.dark,
                        theme.palette.secondary.light,
                    ]
                },
            });
        }

        fetchData();
    }, [])

    return (<>
        <Card>
            <CardHeader title={"Trạng Thái Đơn Hàng"} />
            {
                data &&
                <ChartWrapperStyle dir="ltr">
                    <ReactApexChart options={data.options} series={data.series} type="pie"/>
                </ChartWrapperStyle>
            }
        </Card>

    </>)
}

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}));