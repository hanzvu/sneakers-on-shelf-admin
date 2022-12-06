import { useState, forwardRef } from "react";
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Scrollbar from "../../../components/Scrollbar";
import { getAccountDTOById, getAccountDTOs } from "../../services/AccountService";
import { showSnackbar } from "../../services/NotificationService";
import { getMemberOfferPolicyByAccountId } from "../../services/CartService";

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerAccountSelector({ setSelectedAccount, setSelectedCustomerInfo }) {

    const [open, setOpen] = useState(false);

    const [query, setQuery] = useState('');

    const [data, setData] = useState({ content: [] });

    const handleSearchAccount = () => {
        const params = query.trimStart().trimEnd().length > 0 ? { query } : {};
        getAccountDTOs(params).then(data => {
            setData(data);
        }).catch(() => {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        });
    }

    const handleSelectAccount = async (id) => {
        try {
            const data = await getAccountDTOById(id);
            const memberOfferPolicy = await getMemberOfferPolicyByAccountId(id);
            setSelectedAccount({ ...data, memberOfferPolicy });
            setSelectedCustomerInfo(null);
            handleClose();
        } catch {
            showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
        };
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
                Chọn Tài Khoản
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
                    <Grid container spacing={3} pt={1}>
                        <Grid item xs={7}>
                            <TextField autoFocus fullWidth label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                        </Grid>
                        <Grid item container xs={5}>
                            <Button variant="contained" onClick={handleSearchAccount}>Tìm Kiếm</Button>
                        </Grid>
                    </Grid>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, minHeight: 400 }} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Avatar</TableCell>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Tên Tài Khoản</TableCell>
                                        <TableCell align="center">Tên Khách Hàng</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Ngày Tạo</TableCell>
                                        <TableCell align="center">Ngày Cập Nhật</TableCell>
                                        <TableCell align="center">Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        data.content && data.content.map(account => (
                                            <TableRow hover key={account.id} tabIndex={-1}>
                                                <TableCell align="center">
                                                    <Avatar src={account.picture} alt="photoURL" imgProps={{ referrerPolicy: "no-referrer" }} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {account.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {account.username}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {account.fullname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {account.email}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {new Date(account.createDate).toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" flexWrap>
                                                        {new Date(account.updateDate).toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button variant="outlined" color="primary" onClick={() => { handleSelectAccount(account.id) }}>Chọn</Button>
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