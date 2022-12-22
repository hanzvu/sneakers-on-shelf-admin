import { useState, forwardRef } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Scrollbar from "../../../components/Scrollbar";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerInfoSelector({ customerInfos, setSelectedCustomerInfo  }) {

    const [open, setOpen] = useState(false);

    const handleSelectCustomerInfo = id => {
        handleClose();
        setSelectedCustomerInfo(id);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Chọn Địa Chỉ
            </Button>
            <Dialog
                maxWidth={"lg"}
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Chọn Khách Hàng</DialogTitle>
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Scrollbar>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Họ Và Tên</TableCell>
                                        <TableCell align="center">Số Điện Thoại</TableCell>
                                        <TableCell align="center">Địa Chỉ</TableCell>
                                        <TableCell align="center">Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        Object.values(customerInfos).map(customerInfo => (
                                            <TableRow hover key={customerInfo.id} tabIndex={-1}>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {customerInfo.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {customerInfo.fullname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {customerInfo.phone}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {`${customerInfo.address}, ${customerInfo.wardName}, ${customerInfo.districtName}, ${customerInfo.provinceName}`}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button variant="outlined" color="primary" onClick={() => { handleSelectCustomerInfo(customerInfo.id) }}>Chọn</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Scrollbar>
                </DialogContent>
            </Dialog>
        </>
    )
}