import { Button, Dialog, DialogContent, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, forwardRef } from "react";
import * as Icons from "react-icons/fa";
import Scrollbar from "../../../components/Scrollbar";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DynamicFaIcon = ({ name, size, color }) => {
    const IconComponent = Icons[name];

    if (!IconComponent) { // Return a default one
        return <Icons.FaBeer />;
    }

    return <IconComponent size={size} color={color} />;
};

export default function OrderTimelineDialog({ data }) {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (data == null) {
        return;
    }

    return (
        <>
            <Button variant="contained" color="inherit" size="large" onClick={handleClickOpen}>
                Chi Tiết
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
                <DialogContent sx={{ zIndex: 'modal' }}>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan={2} />
                                        <TableCell align="center">Thời Gian</TableCell>
                                        <TableCell align="center">Người Xác Nhận</TableCell>
                                        <TableCell align="center">Ghi Chú</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        data.map(timeline => (
                                            <TableRow
                                                hover
                                                key={timeline.id}
                                                tabIndex={-1}>
                                                <TableCell width={"5%"}>
                                                    <DynamicFaIcon name={timeline.orderTimelineType.icon} size={40} color={timeline.orderTimelineType.color} />
                                                </TableCell>
                                                <TableCell width={"20%"}>
                                                    {timeline.orderTimelineType.title}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {new Date(timeline.createdDate).toLocaleString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {timeline.staff}
                                                </TableCell>
                                                <TableCell align="center" width={"45%"}>
                                                    {timeline.description}
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