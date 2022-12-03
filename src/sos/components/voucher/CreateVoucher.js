import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions, Container, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { submitVoucher } from "../../services/VoucherService";
import { showSnackbar } from "../../services/NotificationService";

export default function CreateVoucher() {
    const navigate = useNavigate();
    const [dateStart, setDateStart] = React.useState(new Date);
    const [dateEnd, setDateEnd] = React.useState(null);
    const [inputAdornment, setInputAdornment] = React.useState('%');
    const [inputMaxValue, setInputMaxValue] = React.useState(false);
    const [voucherFormInput, setVoucherFormInput] = React.useState({
        code: '',
        amount: '',
        requiredValue: '',
        maxValue: '',
        quantity: '',
        voucherStatus: 'ACTIVE',
        voucherType: 'PERCENT',
        voucherAccess: 'PROTECTED',
        createDate: new Date,
        startDate: new Date,
        experationDate: ''
    })

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'amount') {
            if( e.target.value > 100){
            setInputAdornment('VND');
            setInputMaxValue(true)
            setVoucherFormInput(prevState => ({
                ...prevState,
                maxValue: '',
                voucherType: 'DISCOUNT'
            }));
            } else {
                setInputAdornment('%');
                setInputMaxValue(false)
                setVoucherFormInput(prevState => ({
                    ...prevState,
                    voucherType: 'PERCENT'
                }));
            }
        } 
        setVoucherFormInput(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    const handleSubmitVoucherOnClick = () => {
        if (voucherFormInput.code.length == null || voucherFormInput.code.trimStart().trimEnd().length === 0) {
            showSnackbar("Bạn chưa nhập mã giảm giá", "warning")
            return;
        }
        if (voucherFormInput.amount === '') {
            showSnackbar("Bạn chưa nhập giá trị của voucher", "warning")
            return;
        }
        if (voucherFormInput.voucherType === 'PERCENT' && voucherFormInput.maxValue === '') {
            showSnackbar("Bạn chưa nhập giá trị tối đa cho voucher", "warning")
            return;
        }
        if (voucherFormInput.requiredValue === '') {
            showSnackbar("Bạn chưa nhập điều kiện áp dụng cho voucher", "warning")
            return;
        }
        if (voucherFormInput.experationDate === '') {
            showSnackbar("Bạn chưa chọn ngày hết hạn cho voucher", "warning")
            return;
        }
        if (voucherFormInput.quantity === '') {
            showSnackbar("Bạn chưa nhập số lượng sử dụng cho voucher", "warning")
            return;
        } 
        if(voucherFormInput.startDate > voucherFormInput.experationDate){
            showSnackbar("Ngày kết thúc phải sau ngày bắt đầu", "error")
            return;
        }
        handleSubmitVoucher(voucherFormInput);
    }

    const handleSubmitVoucher = (data) => {
        submitVoucher(data).then(data => {
            navigate(`/dashboard/vouchers`)
            showSnackbar("Thêm mới thành công", "success");
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, "error");
            } else if (error.response.status === 500) {
                showSnackbar("Mã giảm giá này đã tồn tại", "error");
            } else {
                showSnackbar("Có lỗi xảy ra, hãy thử lại sau.", "error");
            }
        })
    }
    
    const handleBackOnClick = e => {
        navigate(`/dashboard/vouchers`);
    }

    return (
        <>
            <Card sx={{ maxWidth: 900 }}>
            <Container>
                <Typography gutterBottom variant="h5" component="div" marginTop={2}>
                    Voucher
                </Typography>

                <Box component="form" autoComplete="off">
                    <Grid container spacing={2} paddingTop={1} justifyContent={"space-between"}>
                        <Grid item xs={6}>
                            <TextField id="outlined-basic" name="code" value={voucherFormInput.code} onChange={handleChange} label="Mã giảm giá" placeholder="Nhập mã giảm giá…" variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Giá trị"
                                id="outlined-start-adornment"
                                fullWidth
                                name="amount"
                                value={voucherFormInput.amount}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Giá trị tối đa (áp dụng với voucher %)"
                                id="outlined-start-adornment"
                                fullWidth
                                name="maxValue"
                                value={voucherFormInput.maxValue}
                                onChange={handleChange}
                                disabled={inputMaxValue}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Điều kiện sử dụng voucher"
                                id="outlined-start-adornment"
                                fullWidth
                                name="requiredValue"
                                value={voucherFormInput.requiredValue}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Áp dụng với đơn hàng từ:</InputAdornment>,
                                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat='dd/MM/yyyy'
                                    minDate={new Date}
                                    label="Ngày bắt đầu"
                                    value={dateStart}
                                    onChange={(newValue) => {
                                        setDateStart(newValue);
                                        setVoucherFormInput(prevState => ({
                                            ...prevState,
                                            startDate: newValue
                                        }));
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    inputFormat='dd/MM/yyyy'
                                    minDate={dateStart}
                                    label="Ngày kết thúc"
                                    value={dateEnd}
                                    onChange={(newValue) => {
                                        setDateEnd(newValue);
                                        setVoucherFormInput(prevState => ({
                                            ...prevState,
                                            experationDate: newValue
                                        }));
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="outlined-basic" label="Lượt áp dụng" name="quantity" value={voucherFormInput.quantity} onChange={handleChange} placeholder="Số lượng sử dụng..." variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Quyền sử dụng</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={voucherFormInput.voucherAccess}
                                    label="Quyền sử dụng"
                                    name="voucherAccess"
                                    onChange={handleChange}
                                >
                                    <MenuItem value='PUBLIC'>Công khai với tất cả mọi người</MenuItem>
                                    <MenuItem value='PROTECTED'>Chỉ một số người mới có quyền sử dụng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid alignSelf={'flex-end'}>
                            <Button size="small" color="primary" onClick={handleSubmitVoucherOnClick}>
                                Tạo mới
                            </Button>
                        </Grid>

                    </Grid>

                </Box>


            </Container>
            <CardActions>
                <Button size="small" color="primary" onClick={handleBackOnClick}>
                    Trở lại
                </Button>
            </CardActions>
        </Card>
        </>
    );
}
