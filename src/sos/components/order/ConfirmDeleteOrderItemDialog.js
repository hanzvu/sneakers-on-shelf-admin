import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Slide, Stack, TextField, Typography } from "@mui/material";
import { useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { deleteOrderItem } from "../../services/OrderService";
import { fCurrency } from "../../../utils/formatNumber";
import { showSnackbar } from "../../services/NotificationService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDeleteOrderItemDialog({ data, setData, onDeleteOrderItemSuccess }) {

    const [description, setDescription] = useState('');

    const onSubmit = () => {
        if (description.trimStart().trimEnd().length === 0) {
            showSnackbar("Vui lòng nhập mô tả.", "warning");
            return;
        }
        deleteOrderItem(data.deletingOrderItem.id, { description }).then(() => {
            onDeleteOrderItemSuccess();
            setData({ ...data, deletingOrderItem: null });
            setDescription('');
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }


    return (
        <>
            <Dialog
                maxWidth={"md"}
                fullWidth
                open={data.deletingOrderItem != null}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setData({ ...data, deletingOrderItem: null }) }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>XÁC NHẬN BỎ SẢN PHẨM</DialogTitle>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    {
                        data.deletingOrderItem &&
                        <Stack>
                            <Grid py={3} container className="border-bottom">
                                <Grid container item lg={8} spacing={2}>
                                    <Grid item lg={4} xs={4}>
                                        <Link to={`/dashboard/products`}><img src={data.deletingOrderItem.image} className="img-fluid" alt="product" /></Link>
                                    </Grid>
                                    <Grid item xs={8} container alignItems={"center"}>
                                        <Stack spacing={1}>
                                            <Typography variant='h5'>
                                                {data.deletingOrderItem.name}
                                            </Typography>
                                            <Typography variant='body2' color={"crimson"}>
                                                {fCurrency(data.deletingOrderItem.price)}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                Size : {data.deletingOrderItem.size}
                                            </Typography>
                                            <Typography variant='body2' color={"dimgray"}>
                                                x {data.deletingOrderItem.quantity}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid container item lg={4} justifyContent={"space-around"} alignItems="center">
                                    <Typography variant='body1' color={"crimson"}>
                                        {fCurrency(data.deletingOrderItem.price * data.deletingOrderItem.quantity)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <TextField label="Mô tả" multiline minRows={4} value={description} onChange={(e) => { setDescription(e.target.value) }} />
                            <Stack alignItems={"flex-end"} pt={2}>
                                <Box>
                                    <Button variant='outlined' color='error' size='large' onClick={onSubmit}>
                                        XÁC NHẬN
                                    </Button>
                                </Box>
                            </Stack>
                        </Stack>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}