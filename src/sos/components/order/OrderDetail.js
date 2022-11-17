import { Box, CardMedia, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline'
import * as Icons from "react-icons/fa";
import OrderItem from "./OrderItem";
import { showSnackbar } from "../../services/NotificationService";
import { getOrderById, updateOrderStatus } from "../../services/OrderService";
import { fCurrency } from "../../../utils/formatNumber";
import OrderStatusDialog from "./OrderStatusDialog";
import Scrollbar from "../../../components/Scrollbar";

export default function OrderDetail() {

    const [data, setData] = useState();

    const params = useParams();

    useEffect(() => {
        if (params.id == null) {
            return;
        }
        getOrderById(params.id).then(data => {
            setData(data)
        })
    }, [params])

    const fetchData = () => {
        getOrderById(params.id).then(data => {
            setData(data)
        })
    }

    const orderStatusOnChange = async (requestData) => {
        try {
            await updateOrderStatus(data.id, requestData)
            fetchData();
        } catch (error) {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        }
    }

    if (data == null) {
        return null;
    }

    return (<>
        <Stack spacing={2}>
            {
                data.timelines &&
                <Paper elevation={3} square>
                    <Box p={{ xs: 1, md: 3 }}>
                        <Scrollbar>
                            <Timeline minEvents={6} variant={"default"} placeholder>
                                {
                                    data.timelines.map(timeline => (
                                        <TimelineEvent
                                            key={timeline.id}
                                            color={timeline.orderTimelineType.color}
                                            icon={Icons[timeline.orderTimelineType.icon]}
                                            title={timeline.orderTimelineType.title}
                                            subtitle={new Date(timeline.createdDate).toLocaleString()} />
                                    ))}

                            </Timeline>
                        </Scrollbar>
                        <Stack direction={"row"} spacing={2}>
                            <OrderStatusDialog hidden={data.orderStatus.name !== "PENDING"} color="primary" buttonTitle={"XÁC NHẬN"} dialogTitle="Xác Nhận Đơn Hàng" onSubmitEvent={orderStatusOnChange} value="CONFIRMED" />
                            <OrderStatusDialog hidden={data.orderStatus.name !== "CONFIRMED" || data.saleMethod.name !== "DELIVERY"} color="primary" buttonTitle={"GIAO HÀNG"} dialogTitle="Xác Nhận Giao Hàng" onSubmitEvent={orderStatusOnChange} value="SHIPPING" required />
                            <OrderStatusDialog hidden={data.orderStatus.name === "APPROVED" || data.orderStatus.name === "CANCELLED"} color="error" buttonTitle={"HỦY ĐƠN"} dialogTitle="Xác Nhận Hủy Đơn" onSubmitEvent={orderStatusOnChange} value="CANCELLED" required />
                            <OrderStatusDialog hidden={data.orderStatus.name !== "CONFIRMED" && data.orderStatus.name !== "SHIPPING"} color="secondary" buttonTitle={"HOÀN THÀNH"} dialogTitle="Xác Nhận Hoàn Thành" onSubmitEvent={orderStatusOnChange} value="APPROVED" required />
                        </Stack>
                    </Box>
                </Paper>
            }

            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box borderBottom={1} borderColor={"grey.500"}>
                        <Typography variant="h5" gutterBottom>
                            THÔNG TIN ĐƠN HÀNG
                        </Typography>
                    </Box>
                    <Stack spacing={3} pt={3} pl={3}>
                        <Grid container >
                            <Grid item container xs={4} alignItems={"center"}>
                                <Typography variant="body1">
                                    Trạng Thái
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Chip label={data.orderStatus.description} color={data.orderStatus.color} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item container xs={4} alignItems={"center"}>
                                <Typography variant="body1">
                                    Loại
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Chip label={data.saleMethod.description} color={data.saleMethod.color} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item container xs={4} alignItems={"center"}>
                                <Typography variant="body1">
                                    Mã Đơn Hàng
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1">
                                    {data.id}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item container xs={4} alignItems={"center"}>
                                <Typography variant="body1">
                                    Họ Và Tên
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1">
                                    {data.fullname}
                                </Typography>
                            </Grid>
                        </Grid>
                        {
                            data.phone &&
                            <Grid container >
                                <Grid item container xs={4} alignItems={"center"}>
                                    <Typography variant="body1">
                                        Số Điện Thoại
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">
                                        {data.phone}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                        {
                            data.email &&
                            <Grid container >
                                <Grid item container xs={4} alignItems={"center"}>
                                    <Typography variant="body1">
                                        Email
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">
                                        {data.email}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                        {
                            data.address &&
                            <Grid container >
                                <Grid item container xs={4} alignItems={"center"}>
                                    <Typography variant="body1">
                                        Địa Chỉ
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">
                                        {`${data.detailedAddress}, ${data.address}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }
                    </Stack>
                </Box>
            </Paper>

            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box>
                        {data.items.map(item => (<OrderItem key={item.id} orderItem={item} customName={data.customerInfo ? data.customerInfo.fullname : 'Khách Lẻ'} idPurchase={data.id} userTokenQuery={data.userTokenQuery} />))}
                    </Box>
                    <Grid container spacing={1} pt={3} justifyContent={"flex-end"}>
                        <Grid item md={4} xs={12}>
                            <Stack spacing={1}>
                                <Grid item container >
                                    <Grid item container xs={6}>
                                        <Typography variant="body1">
                                            Tiền Hàng
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Typography variant="body1">
                                            {fCurrency(data.total)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container >
                                    <Grid item container xs={6}>
                                        <Typography variant="body1">
                                            Phí vận chuyển
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Typography variant="body1">
                                            {fCurrency(data.fee)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {
                                    
                                }
                                <Grid item container >
                                    <Grid item container xs={6}>
                                        <Typography variant="body1">
                                            Giảm Giá
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Typography variant="body1">
                                            {fCurrency(data.discount)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container >
                                    <Grid item container xs={6}>
                                        <Typography sx={{ fontWeight: 'bold' }} >
                                            Tổng Số Tiền
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Typography sx={{ fontWeight: 'bold' }} color="error">
                                            {fCurrency(data.total + data.fee - data.discount)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {
                data.paymentQRCode &&
                <Paper elevation={3} square>
                    <Box p={{ xs: 1, md: 3 }}>
                        <Grid container justifyContent={"center"}>
                            <Grid item md={5} xs={12}>
                                <CardMedia component="img" image={data.paymentQRCode} alt="green iguana" />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            }
        </Stack>

    </>)
}