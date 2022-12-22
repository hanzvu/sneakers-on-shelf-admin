import { Box, Button, CardMedia, Chip, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline'
import * as Icons from "react-icons/fa";
import OrderItem from "./OrderItem";
import { showSnackbar } from "../../services/NotificationService";
import { addOrderItem, getOrderById, updateOrderStatus } from "../../services/OrderService";
import { fCurrency, toVietnamese } from "../../../utils/formatNumber";
import OrderStatusDialog from "./OrderStatusDialog";
import Scrollbar from "../../../components/Scrollbar";
import ConfirmTransaction from "./ConfirmTransaction";
import UpdateDeliveryAddress from "./UpdateDeliveryAddress";
import OrderTimelineDialog from "./OrderTimelineDialog";
import ChangeOrderItemQuantity from "./ChangeOrderItemQuantity";
import ConfirmDeleteOrderItemDialog from "./ConfirmDeleteOrderItemDialog";
import ProductSeletor from "../cart/ProductSeletor";
import ConfirmReverseOrderItem from "./ConfirmReverseOrderItem";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

export default function OrderDetail() {

    const [data, setData] = useState();

    const params = useParams();

    useEffect(() => {
        if (params.id == null) {
            return;
        }
        fetchData();
    }, [params])

    const fetchData = () => {
        getOrderById(params.id).then(rs => {
            setData({
                ...rs,
                transactions: {
                    content: rs.transactions,
                    paymentAmount: rs.transactions == null ? 0 : rs.transactions.filter(trans => trans.transactionStatus.name === 'APPROVED' && trans.transactionType.name === 'PAYMENT'
                    ).reduce((total, item) => (total + item.amount), 0),
                    reverseAmount: rs.transactions == null ? 0 : rs.transactions.filter(trans => trans.transactionStatus.name === 'APPROVED' && trans.transactionType.name === 'REVERSE'
                    ).reduce((total, item) => (total + item.amount), 0)
                },
                requiredAmount: calculateTotal(rs.total, rs.fee, rs.discount, rs.memberOffer, rs.refund)
            })
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

    const onCreateTransaction = () => {
        fetchData();
    }

    const onChangeDeliveryAddress = () => {
        fetchData();
    }

    const handleSelectProductDetail = async ({ id, quantity }) => {
        if (quantity < 1) {
            showSnackbar("Số lượng sản phẩm không hợp lệ.", "warning")
            return;
        }
        addOrderItem(data.id, { productDetail: { id }, quantity }).then(() => {
            fetchData();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    const calculateTotal = (total, fee, discount, offer, refund) => {
        const rs = total + fee - discount - offer - refund;
        return rs > 0 ? rs : 0;
    }

    const handleReverse = (item) => {
        if (data.discount > 0) {
            showSnackbar('Trả hàng không áp dụng cho đơn hàng giảm giá.', 'warning')
            return;
        }
        setData({ ...data, reverseOrderItem: item });
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
                            <Box display={"inline-block"}>
                                <Timeline minEvents={10} placeholder >
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
                            </Box>
                        </Scrollbar>
                        <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                            <Stack direction={"row"} spacing={2} pt={1}>
                                <OrderStatusDialog hidden={data.orderStatus.name !== "PENDING"} color="primary" buttonTitle={"XÁC NHẬN"} dialogTitle="Xác Nhận Đơn Hàng" onSubmitEvent={orderStatusOnChange} value="CONFIRMED" />
                                <OrderStatusDialog hidden={data.orderStatus.name !== "CONFIRMED" || data.saleMethod.name !== "DELIVERY"} color="primary" buttonTitle={"GIAO HÀNG"} dialogTitle="Xác Nhận Giao Hàng" onSubmitEvent={orderStatusOnChange} value="SHIPPING" required />
                                <OrderStatusDialog hidden={data.orderStatus.name === "APPROVED" || data.orderStatus.name === "CANCELLED"} color="error" buttonTitle={"HỦY ĐƠN"} dialogTitle="Xác Nhận Hủy Đơn" onSubmitEvent={orderStatusOnChange} value="CANCELLED" required />
                                <OrderStatusDialog hidden={data.orderStatus.name !== "CONFIRMED" && data.orderStatus.name !== "SHIPPING" || (data.orderStatus.name !== 'SHIPPING' && data.saleMethod.name === 'DELIVERY')} color="secondary" buttonTitle={"HOÀN THÀNH"} dialogTitle="Xác Nhận Hoàn Thành" onSubmitEvent={orderStatusOnChange} value="APPROVED" required />
                            </Stack>
                            <OrderTimelineDialog data={data.timelines} />
                        </Grid>

                    </Box>
                </Paper>
            }

            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box borderBottom={1} borderColor={"grey.500"}>
                        <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                            <Typography variant="h5" gutterBottom>
                                THÔNG TIN ĐƠN HÀNG
                            </Typography>
                            {(data.orderStatus.name === 'PENDING' || data.orderStatus.name === 'CONFIRMED') && data.saleMethod.name === 'DELIVERY'
                                &&
                                < UpdateDeliveryAddress data={data} onChangeDeliveryAddress={onChangeDeliveryAddress} />
                            }
                        </Grid>

                    </Box>

                    <Grid pt={3} pl={3} container item xs={12}>
                        <Grid container item xs={6}>
                            <Grid item xs={12}>
                                <Stack spacing={2} >
                                    <Grid item container >
                                        <Grid item container xs={4} alignItems={"center"}>
                                            <Typography variant="subtitle1">
                                                Trạng Thái
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Chip label={data.orderStatus.description} color={data.orderStatus.color} />
                                        </Grid>
                                    </Grid>
                                    <Grid item container >
                                        <Grid item container xs={4} alignItems={"center"}>
                                            <Typography variant="subtitle1">
                                                Loại
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Chip label={data.saleMethod.description} color={data.saleMethod.color} />
                                        </Grid>
                                    </Grid>
                                    <Grid item container >
                                        <Grid item container xs={4} alignItems={"center"}>
                                            <Typography variant="subtitle1">
                                                Mã Đơn Hàng
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">
                                                {data.id}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item container xs={6}>
                            <Grid item xs={12}>
                                <Stack spacing={2}>
                                    <Grid container item>
                                        <Grid item container xs={4} alignItems={"center"}>
                                            <Typography variant="subtitle1">
                                                Họ Và Tên
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            {
                                                data.fullname &&
                                                <Typography variant="body1">
                                                    {data.fullname}
                                                </Typography>
                                            }
                                            <Chip label="Khách lẻ" color="default" hidden={data.fullname} />
                                        </Grid>
                                    </Grid>
                                    {
                                        data.phone &&
                                        <Grid container item>
                                            <Grid item container xs={4} alignItems={"center"}>
                                                <Typography variant="subtitle1">
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
                                        <Grid container item>
                                            <Grid item container xs={4} alignItems={"center"}>
                                                <Typography variant="subtitle1">
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
                                                <Typography variant="subtitle1">
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
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box borderBottom={1} borderColor={"grey.500"}>
                        <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                            <Typography variant="h5">
                                LỊCH SỬ THANH TOÁN
                            </Typography>
                            <Stack direction={"row"} spacing={1}>
                                <ConfirmTransaction data={data} onCreateTransaction={onCreateTransaction} />
                            </Stack>
                        </Grid>
                    </Box>
                    {
                        data.transactions.content && data.transactions.content.length > 0 &&
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Số Tiền</TableCell>
                                            <TableCell align="center">Thời Gian</TableCell>
                                            <TableCell align="center">Loại Giao Dịch</TableCell>
                                            <TableCell align="center">Phương Thức Thanh Toán</TableCell>
                                            <TableCell align="center">Trạng Thái</TableCell>
                                            <TableCell align="center">Ghi Chú</TableCell>
                                            <TableCell align="center">Nhân Viên Xác Nhận</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {
                                            data.transactions.content.map(transaction => (
                                                <TableRow hover tabIndex={-1} key={transaction.id}>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" flexWrap color={"crimson"}>
                                                            {fCurrency(transaction.amount)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" flexWrap>
                                                            {new Date(transaction.createDate).toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={transaction.transactionType.description} color={transaction.transactionType.color} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={transaction.paymentMethod.description} color={transaction.paymentMethod.color} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={transaction.transactionStatus.description} color={transaction.transactionStatus.color} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" flexWrap>
                                                            {transaction.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" flexWrap>
                                                            {transaction.staff}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {
                                (data.transactions.paymentAmount - data.transactions.reverseAmount > 0) &&
                                <Box borderTop={1} borderColor={"grey.500"}>
                                    <Grid container spacing={1} pt={3} justifyContent={"space-between"}>
                                        <Grid item md={4} xs={12}>
                                            {
                                                data.transactions.paymentAmount - data.transactions.reverseAmount >= data.requiredAmount ?
                                                    <Chip color="primary" label="Đã Thanh Toán Xong" />
                                                    :
                                                    <Chip color="warning" label="Chưa Thanh Toán Xong" />
                                            }
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                            <Stack spacing={1}>
                                                <Grid item container >
                                                    <Grid item container xs={6}>
                                                        <Typography variant="body1">
                                                            Đã Thanh Toán
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                                        <Typography variant="body1" color="crimson">
                                                            {fCurrency(data.transactions.paymentAmount - data.transactions.reverseAmount)}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }
                        </Scrollbar>
                    }
                    {
                        data.transactions.content.length === 0 &&
                        <Typography variant="body1" pt={2} color={"dimgrey"}>
                            Không Có Dữ Liệu
                        </Typography>
                    }
                </Box>

            </Paper>

            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box>
                        {
                            data.items.filter(item => (item.orderItemStatus.name === 'APPROVED')).map(item => (
                                <OrderItem key={item.id} orderItem={item} component={
                                    <OrderItemButton status={data.orderStatus.name} handleUpdate={() => { setData({ ...data, changingProductQuantity: item }) }} handleDelete={() => { setData({ ...data, deletingOrderItem: item }) }} handleReverse={() => { handleReverse(item) }} />}
                                />))
                        }
                        {
                            data.items.filter(item => (item.orderItemStatus.name === 'REVERSE')).map(item => (
                                <OrderItem key={item.id} orderItem={item} component={
                                    <Chip variant="outlined" label={item.orderItemStatus.description} color={item.orderItemStatus.color} />
                                }
                                />))
                        }
                    </Box>
                    <Grid container spacing={1} pt={3} justifyContent={"space-between"}>
                        <Grid item md={4} xs={12}>
                            {
                                (data.orderStatus.name === 'PENDING' || data.orderStatus.name === 'CONFIRMED') &&
                                <ProductSeletor handleSelectProductDetail={handleSelectProductDetail} />
                            }
                        </Grid>
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
                                {
                                    data.memberOffer > 0 &&
                                    <Grid item container >
                                        <Grid item container xs={6}>
                                            <Typography variant="body1">
                                                Quyền lợi thành viên
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} container justifyContent={"flex-end"}>
                                            <Typography variant="body1">
                                                {fCurrency(data.memberOffer)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                {
                                    data.refund > 0 &&
                                    <Grid item container >
                                        <Grid item container xs={6}>
                                            <Typography variant="body1">
                                                Trả hàng
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} container justifyContent={"flex-end"}>
                                            <Typography variant="body1">
                                                {fCurrency(data.refund)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                <Grid item container >
                                    <Grid item container xs={6}>
                                        <Typography sx={{ fontWeight: 'bold' }} >
                                            Tổng Số Tiền
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Typography sx={{ fontWeight: 'bold' }} color="crimson">
                                            {fCurrency(data.requiredAmount)}
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
        {
            data.changingProductQuantity &&
            <ChangeOrderItemQuantity data={data} setData={setData} onChangeProductQuantitySuccess={fetchData} />
        }
        {
            data.deletingOrderItem &&
            <ConfirmDeleteOrderItemDialog data={data} setData={setData} onDeleteOrderItemSuccess={fetchData} />
        }

        {
            data.reverseOrderItem &&
            <ConfirmReverseOrderItem data={data} setData={setData} onReverseSuccess={fetchData} />
        }
    </>)
}

const OrderItemButton = ({ status, handleUpdate, handleDelete, handleReverse }) => {
    if (status === 'PENDING' || status === 'CONFIRMED') {
        return <Stack direction={"row"} spacing={2}>
            <Button variant="outlined" onClick={handleUpdate}>Cập Nhật</Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>Hủy</Button>
        </Stack>;
    }

    if (status === 'APPROVED' || status === 'CONFIRMED') {
        return <Stack direction={"row"} spacing={2}>
            <Button variant="contained" color="error" onClick={handleReverse}>Trả Hàng</Button>
        </Stack>;
    }
    return null;
}