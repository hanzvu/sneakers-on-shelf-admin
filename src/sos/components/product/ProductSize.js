import { Box, Button, Chip, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { showSnackbar } from "../../services/NotificationService"
import { changeProductDetailQuantity, changeProductDetailStatus } from "../../services/ProductDetailService"
import Scrollbar from "../../../components/Scrollbar"
import CartIncrementer from "../cart/CartIncrementer"
import CreateProductSize from "./CreateProductSize"

export const ProductSize = ({ product, fetchData }) => {

    const handleChangeQuantity = (id, quantity) => {
        if (quantity < 0) {
            showSnackbar('Số lượng không hợp lệ.', 'error')
            return;
        }
        changeProductDetailQuantity(id, quantity).then(() => {
            fetchData();
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    const handleChangeStatus = (id, status) => {
        changeProductDetailStatus(id, status).then(() => {
            fetchData();
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    return (<>
        <Paper elevation={3} square>
            <Box p={{ xs: 1, md: 3 }}>
                <Grid container justifyContent="center" pb={1} alignItems="center">
                    <Typography variant="h4" align='center' color={"gray"}>
                        Kích Cỡ Và Số Lượng
                    </Typography>
                </Grid>
                <Container maxWidth="md">
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Kích Cỡ</TableCell>
                                        <TableCell align="center">Số Lượng</TableCell>
                                        <TableCell align="center">Trạng Thái</TableCell>
                                        <TableCell align="center">Thao Tác</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        product.productDetails.length !== 0 && product.productDetails.map(pd => (
                                            <TableRow
                                                hover
                                                key={pd.id}
                                                tabIndex={-1}
                                                role="checkbox">
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {pd.size}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction={"row"} justifyContent={"center"}>
                                                        <CartIncrementer
                                                            name="quantity"
                                                            quantity={pd.quantity}
                                                            onBlurHandler={value => handleChangeQuantity(pd.id, value)}
                                                            onIncrementQuantity={() => handleChangeQuantity(pd.id, pd.quantity + 1)}
                                                            onDecrementQuantity={() => handleChangeQuantity(pd.id, pd.quantity - 1)} />
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip label={pd.activeStatus.description} color={pd.activeStatus.color} />
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Stack spacing={2} direction={"row"} justifyContent="center">
                                                        {
                                                            pd.activeStatus.name === 'ACTIVE' &&
                                                            <Button variant="outlined" color="error" onClick={() => { handleChangeStatus(pd.id, 'INACTIVE') }}>Hủy Kích Hoạt</Button>
                                                        }
                                                        {
                                                            pd.activeStatus.name === 'INACTIVE' &&
                                                            <Button variant="outlined" color="warning" onClick={() => { handleChangeStatus(pd.id, 'ACTIVE') }}>Tái Kích Hoạt</Button>
                                                        }
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }

                                    {
                                        product.productDetails.length === 0 &&
                                        <TableRow>
                                            <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                                                <Typography gutterBottom align="center" variant="subtitle1">
                                                    Không Có Dữ Liệu
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                    <Stack direction={"row"} justifyContent="center" p={3}>
                        <CreateProductSize id={product.id} fetchData={fetchData} />
                    </Stack>
                </Container>
            </Box>
        </Paper>
    </>)
}