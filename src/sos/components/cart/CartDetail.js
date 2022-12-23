import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Chip, Collapse, Container, FormControlLabel, Grid, ListItemIcon, Paper, Stack, styled, Switch, TextField, Typography } from "@mui/material";
import { fCurrency } from "../../../utils/formatNumber";
import CartItem from "./CartItem";
import { addToCart, getCartById, submitCart } from "../../services/CartService";
import AccountAddressForm from "./AccountAddressForm";
import CustomerInfoSelector from "./CustomerInfoSelector";
import CustomerAccountSelector from "./CustomerAccountSelector";
import ProductSeletor from "./ProductSeletor";
import Iconify from "../../../components/Iconify";
import { getDeliveryInfo } from "../../services/DeliveryService";
import { showSnackbar } from "../../services/NotificationService";
import VoucherSelector from "./VoucherSelector";

export default function CartDetail() {

    const params = useParams();

    const navigate = useNavigate();

    const [cart, setCart] = useState();

    const [selectedAccount, setSelectedAccount] = useState();

    const [selectedCustomerInfo, setSelectedCustomerInfo] = useState();

    const [shipping, setShipping] = useState(false);

    const [delivery, setDelivery] = useState({ fee: 0, leadtime: null })

    const [voucher, setVoucher] = useState({ discount: 0 });

    const [addressFormInput, setAddressFormInput] = useState({
        province: null,
        district: null,
        ward: null,
        fullname: '',
        phone: '',
        address: '',
        email: ''
    })

    useEffect(() => {
        fetchCart();
    }, [])

    const handleAddressSelectDone = (wardCode) => {
        getDeliveryInfo(cart.id, addressFormInput.district.DistrictID, wardCode).then(response => setDelivery(response))
    }

    const handleSetSelectedCustomerInfo = id => {
        setSelectedCustomerInfo(id);
        fetchDeliveryInfoByCustomerInfo(id);
    }

    const fetchDeliveryInfoByCustomerInfo = (id) => {
        getDeliveryInfo(cart.id, selectedAccount.customerInfos[id].districtId, selectedAccount.customerInfos[id].wardCode).then(response => setDelivery(response));
    }

    const handleSelectProductDetail = async ({ id, quantity }) => {
        await addToCart(cart.id, id, quantity);
        fetchCart();
    }

    const fetchCart = () => {
        getCartById(params.id).then(data => {
            setCart({ ...data, total: data.items == null ? 0 : data.items.reduce((total, item) => (total + item.price * item.quantity), 0) });
            setVoucher({ discount: 0 });
            if (selectedCustomerInfo) {
                fetchDeliveryInfoByCustomerInfo(selectedCustomerInfo);
            } else if (addressFormInput.ward != null) {
                handleAddressSelectDone();
            }
        })
    }

    const handleSelectVoucher = data => {
        if (data.voucherType === "PERCENT") {
            if (data.amount <= 0 || data.amount > 100) {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau")
                return;
            }
            const d = Math.floor(cart.total * data.amount / 100);
            const rs = d >= data.maxValue ? data.maxValue : d;
            setVoucher({ ...voucher, data, discount: rs >= cart.total ? cart.total : rs })
        } else {
            setVoucher({ ...voucher, data, discount: data.amount > cart.total ? cart.total : data.amount })
        }
    }

    const handleSubmitCartOnClick = () => {
        if (cart.items.length === 0) {
            showSnackbar("Không có sản phẩm nào trong giỏ.", "warning");
            return;
        }

        const selectedVoucher = voucher.data ? { id: voucher.data.id } : null;

        if (shipping) {
            if (selectedCustomerInfo) {
                handleSubmitCart({
                    customerInfo: {
                        ...selectedAccount.customerInfos[selectedCustomerInfo],
                        account: { id: selectedAccount.id }
                    },
                    email: selectedAccount.email,
                    saleMethod: "DELIVERY",
                    voucher: selectedVoucher
                });
            } else {
                if (addressFormInput.province == null || addressFormInput.district == null || addressFormInput.ward == null || addressFormInput.address == null) {
                    showSnackbar("Bạn chưa chọn xong địa chỉ.", "warning")
                    return;
                }

                if (selectedAccount == null && addressFormInput.email == null) {
                    showSnackbar("Bạn chưa nhập email.", "warning")
                    return;
                }

                const customerInfo = {
                    fullname: addressFormInput.fullname,
                    phone: addressFormInput.phone,
                    address: addressFormInput.address,
                    provinceId: addressFormInput.province.ProvinceID,
                    provinceName: addressFormInput.province.ProvinceName,
                    districtId: addressFormInput.district.DistrictID,
                    districtName: addressFormInput.district.DistrictName,
                    wardCode: addressFormInput.ward.WardCode,
                    wardName: addressFormInput.ward.WardName,
                    account: selectedAccount ? { id: selectedAccount.id } : null
                }

                handleSubmitCart(
                    {
                        customerInfo,
                        email: selectedAccount ? selectedAccount.email : addressFormInput.email,
                        saleMethod: "DELIVERY",
                        voucher: selectedVoucher
                    }
                );
            }
        } else if (selectedAccount) {
            handleSubmitCart(
                {
                    customerInfo: {
                        account: {
                            id: selectedAccount.id
                        },
                        fullname: selectedAccount.fullname
                    },
                    email: selectedAccount.email,
                    saleMethod: "RETAIL",
                    voucher: selectedVoucher
                }
            );
        } else {
            handleSubmitCart(
                {
                    customerInfo: {
                        account: null
                    },
                    email: null,
                    saleMethod: "RETAIL",
                    voucher: selectedVoucher
                }
            );
        }
    }

    const handleSubmitCart = (data) => {
        submitCart(cart.id, data).then(data => {
            navigate(`/dashboard/orders/${data.id}`)
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }

    const calculateTotal = (total, fee, discount, offer) => {
        const rs = total + fee - discount - Math.floor(offer > 0 ? total * offer / 100 : 0);
        return rs > 0 ? Math.floor(rs) : 0;
    }

    if (cart == null) {
        return null;
    }

    return (<>
        <Container disableGutters>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Link to={"/dashboard/carts"}><Button variant="contained">{'DANH SÁCH'}</Button></Link>
                <ProductSeletor handleSelectProductDetail={handleSelectProductDetail} />
            </Stack>

            <Stack spacing={3} pt={3}>
                <Paper elevation={3} square>
                    <Box px={2}>
                        {
                            cart.items && cart.items.length > 0 &&
                            <>
                                <Grid container spacing={1} py={2} sx={{ display: { xs: "none", md: "flex" } }} className={"border-bottom"}>
                                    <Grid item container lg={7} justifyContent="center" alignItems="center">
                                        Sản Phẩm
                                    </Grid>
                                    <Grid item lg={5} container spacing={2}>
                                        <Grid item container md={4} xs={6} justifyContent="center" alignItems="center">
                                            Số Lượng
                                        </Grid>
                                        <Grid item container md={4} xs={6} justifyContent="center" alignItems="center">
                                            Số Tiền
                                        </Grid>
                                        <Grid item container md={4} xs={12} justifyContent="center" alignItems="center">
                                            Thao Tác
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {
                                    cart.items.map(item => (
                                        < CartItem key={item.id} item={item} onSuccess={fetchCart} />
                                    ))
                                }
                                <Grid container py={2} justifyContent={"flex-end"}>
                                    <Grid container item lg={3}>
                                        <Grid item xs={6}>
                                            Tổng số tiền :
                                        </Grid>
                                        <Grid item xs={6} pr={2}>
                                            <Typography variant="body1" color="crimson" textAlign={"end"}>
                                                {fCurrency(cart.total)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        }

                        {
                            (cart.items == null || cart.items.length === 0) &&
                            <Grid container justifyContent={"center"} p={3}>
                                <Stack spacing={3}>
                                    <img src='https://bizweb.dktcdn.net/100/377/398/themes/755909/assets/empty_cart.png?1669026383948' alt='cart empty' />
                                    <Typography variant='body1' color={"dimgray"} align='center'>
                                        Không có sản phẩm nào trong giỏ hàng.
                                    </Typography>
                                </Stack>
                            </Grid>
                        }

                    </Box>

                </Paper>
                <Paper elevation={3} square>
                    <Box p={{ xs: 1, md: 3 }}>
                        <Box borderBottom={1} borderColor={"grey.500"}>
                            <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                                <Typography variant="h5">
                                    Tài Khoản
                                </Typography>
                                <Stack direction={"row"} spacing={1}>
                                    <CustomerAccountSelector setSelectedAccount={setSelectedAccount} setSelectedCustomerInfo={setSelectedCustomerInfo} />
                                    {selectedAccount && <Button variant="outlined" color="error" onClick={() => { setSelectedCustomerInfo(null); setSelectedAccount(null); }}>Bỏ Chọn</Button>}

                                </Stack>
                            </Grid>
                        </Box>
                        <Grid container pt={3}>
                            <Grid item container xs={3} alignItems={"center"}>
                                <Typography variant="body1">
                                    Tên Khách Hàng
                                </Typography>
                            </Grid>
                            <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                {
                                    selectedAccount &&
                                    <Typography variant="body1">
                                        {selectedAccount.fullname}
                                    </Typography>
                                }
                                {
                                    selectedAccount == null &&
                                    <Chip label='Khách Lẻ' color="default" />
                                }

                            </Grid>
                        </Grid>

                        {
                            selectedAccount &&
                            <>
                                <Grid container pt={3}>
                                    <Grid item container xs={3} alignItems={"center"}>
                                        <Typography variant="body1">
                                            Tên Tài Khoản
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography variant="body1">
                                            {selectedAccount.username}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container pt={3}>
                                    <Grid item container xs={3} alignItems={"center"}>
                                        <Typography variant="body1">
                                            Email
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography variant="body1">
                                            {selectedAccount.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </Box>
                </Paper>

                <Paper elevation={3} square>
                    <Box p={{ xs: 1, md: 3 }}>
                        <Box borderBottom={1} borderColor={"grey.500"}>
                            <Grid container justifyContent={"space-between"} pb={1} alignItems="center">
                                <Typography variant="h5">
                                    Khách Hàng
                                </Typography>
                                <Stack direction={"row"} spacing={1}>
                                    {
                                        selectedAccount && selectedAccount.customerInfos &&
                                        <CustomerInfoSelector customerInfos={selectedAccount.customerInfos} setSelectedCustomerInfo={handleSetSelectedCustomerInfo} />
                                    }
                                    {
                                        selectedCustomerInfo &&
                                        <Button variant="outlined" color="error" onClick={() => { setSelectedCustomerInfo(null); setDelivery({ fee: 0, leadtime: null }) }}>Bỏ Chọn</Button>
                                    }
                                </Stack>
                            </Grid>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={7}>
                                {shipping &&
                                    <Stack pt={3} spacing={3}>
                                        {
                                            selectedCustomerInfo &&
                                            <>
                                                <Grid container pt={3}>
                                                    <Grid item container xs={3} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            ID
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            {selectedCustomerInfo}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container pt={3}>
                                                    <Grid item container xs={3} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            Họ Và Tên
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            {selectedAccount.customerInfos[selectedCustomerInfo].fullname}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container pt={3}>
                                                    <Grid item container xs={3} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            Số Điện Thoại
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            {selectedAccount.customerInfos[selectedCustomerInfo].phone}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container pt={3}>
                                                    <Grid item container xs={3} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            Địa Chỉ
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container xs={9} justifyContent={"space-between"} alignItems={"center"}>
                                                        <Typography variant="body1">
                                                            {`${selectedAccount.customerInfos[selectedCustomerInfo].address}, ${selectedAccount.customerInfos[selectedCustomerInfo].wardName}, ${selectedAccount.customerInfos[selectedCustomerInfo].districtName}, ${selectedAccount.customerInfos[selectedCustomerInfo].provinceName}`}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        {
                                            (selectedCustomerInfo == null && shipping) &&
                                            <Container disableGutters>
                                                <Collapse in={shipping} sx={{ width: '100%' }}>
                                                    <AccountAddressForm handleAddressSelectDone={handleAddressSelectDone} addressFormInput={addressFormInput} setAddressFormInput={setAddressFormInput} haveEmail={selectedAccount == null} />
                                                </Collapse>
                                            </Container>
                                        }

                                        {
                                            delivery.leadtime &&
                                            <Grid item xs={12} pt={3} alignItems={"center"}>
                                                <Box className="d-flex align-items-center pb-3">
                                                    <ListItemIconStyle><Iconify icon={"carbon:delivery"} width={30} height={30} /></ListItemIconStyle>
                                                    <Typography
                                                        component="span"
                                                        variant="h6" textAlign={"end"}>
                                                        Thời gian nhận hàng dự kiến : {new Date(delivery.leadtime * 1000).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Box className="d-flex align-items-center pb-3">
                                                    <ListItemIconStyle><Iconify icon={"carbon:delivery"} width={30} height={30} /></ListItemIconStyle>
                                                    <Typography
                                                        component="span"
                                                        variant="h6" textAlign={"end"}>
                                                        Đơn vị vận chuyển : <a href="https://ghn.vn/" className="text-decoration-none text-primary">Giao Hàng Nhanh</a>
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        }
                                    </Stack>
                                }
                            </Grid>
                            <Grid item xs={5}>
                                <Stack spacing={3} pt={3}>
                                    <Box className="d-flex align-items-center">
                                        <ListItemIconStyle><Iconify icon={"eva:shopping-bag-fill"} width={30} height={30} /></ListItemIconStyle>
                                        <Typography variant="h4">
                                            Thông Tin Thanh Toán
                                        </Typography>
                                    </Box>
                                    <FormControlLabel onChange={() => { setShipping((prev) => !prev) }} checked={shipping} control={<IOSSwitch sx={{ m: 1 }} />} label="Giao Hàng" />
                                    <Grid item container spacing={1}>
                                        <Stack direction={"row"} spacing={1} justifyContent={"center"}>
                                            <TextField variant="outlined" size="small" value={(voucher.data && voucher.data.code) || ''} inputProps={{ readOnly: true, }} label="Mã Giảm Giá" />
                                            <VoucherSelector value={cart.total} handleSelectVoucher={handleSelectVoucher} />
                                        </Stack>
                                    </Grid>
                                    <Grid item container >
                                        <Grid item container xs={6}>
                                            <Typography variant="body1">
                                                Tiền Hàng
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} container justifyContent={"flex-end"}>
                                            <Typography variant="body1">
                                                {fCurrency(cart.total)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {
                                        shipping &&
                                        <Grid item container >
                                            <Grid item container xs={6}>
                                                <Typography variant="body1">
                                                    Phí vận chuyển
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} container justifyContent={"flex-end"}>
                                                <Typography variant="body1">
                                                    {fCurrency(delivery.fee)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                    {
                                        voucher &&
                                        <Grid item container >
                                            <Grid item container xs={6}>
                                                <Typography variant="body1">
                                                    Giảm Giá
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} container justifyContent={"flex-end"}>
                                                <Typography variant="body1">
                                                    {fCurrency(voucher.discount)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    }

                                    {
                                        selectedAccount && selectedAccount.memberOfferPolicy && selectedAccount.memberOfferPolicy.offer > 0 &&
                                        <Grid item container >
                                            <Grid item container xs={6}>
                                                <Typography variant="body1">
                                                    Quyền lợi thành viên {selectedAccount.memberOfferPolicy.memberRank.description} ({selectedAccount.memberOfferPolicy.offer}%)
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} container justifyContent={"flex-end"}>
                                                <Typography variant="body1">
                                                    {fCurrency(Math.floor(cart.total * selectedAccount.memberOfferPolicy.offer / 100))}
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
                                            <Typography sx={{ fontWeight: 'bold' }} color="error">
                                                {fCurrency(calculateTotal(cart.total, (shipping ? delivery.fee : 0), (voucher ? voucher.discount : 0), (selectedAccount && selectedAccount.memberOfferPolicy ? selectedAccount.memberOfferPolicy.offer : 0)))}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container item justifyContent={"end"}>
                                        <div className="pt-2 px-lg-0">
                                            <button onClick={handleSubmitCartOnClick} className="btn btn-dark shadow-none rounded-0 border-dark float-end">
                                                Xác Nhận Đặt Hàng
                                            </button>
                                        </div>
                                    </Grid>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

            </Stack>
        </Container>
    </>)
}


const ListItemIconStyle = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));