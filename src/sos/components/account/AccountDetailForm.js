import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Chip, Container, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Paper, Slide, Stack, styled, Switch, Typography } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { createAccount, resetAccountPassword, updateAccountInfo, updateAccountStatus } from '../../services/AccountService';
import { showSnackbar } from '../../services/NotificationService';

export default function AccountDetailForm({ account, fetchData }) {

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(account.admin);

    const [password, setPassword] = useState();

    const RegisterSchema = Yup.object().shape({
        username: account.id != null ? null : Yup.string().required('Vui lòng nhập tên tài khoản.'),
        fullname: Yup.string().required('Vui lòng nhập họ và tên.'),
        email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email.'),
    });

    const defaultValues = {
        username: account.username ? account.username : '',
        fullname: account.fullname ? account.fullname : '',
        email: account.email ? account.email : '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        if (account.id != null) {
            updateAccountInfo(account.id, { ...data, admin: isAdmin }).then((created) => {
                showSnackbar('Cập nhật tài khoản thành công.')
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    showSnackbar(error.response.data, 'error')
                } else {
                    showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
                }
            })
        } else {
            createAccount({ ...data, admin: isAdmin }).then((created) => {
                showSnackbar('Thêm tài khoản thành công.');
                navigate(`/dashboard/accounts/${created}`);
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    showSnackbar(error.response.data, 'error')
                } else {
                    showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
                }
            })
        }
    }

    const handleSetAccountStatus = (accountStatus) => {
        updateAccountStatus(account.id, accountStatus).then(() => {
            fetchData();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    const handleResetPassword = () => {
        resetAccountPassword(account.id).then(data => {
            setPassword(data);
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    return (<>
        <Stack spacing={3}>
            <Paper elevation={3} square>
                <Box p={{ xs: 1, md: 3 }}>
                    <Box>
                        <Grid container justifyContent={"center"} pb={1} alignItems="center">
                            <Typography variant="h4" align='center' color={"gray"}>
                                {account.id != null ? 'Cập Nhật Tài Khoản' : 'Tạo Tài Khoản'}
                            </Typography>
                        </Grid>
                        <Container maxWidth="md">
                            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3} p={3}>
                                    <RHFTextField name="username" label="Tên tài khoản" disabled={account.id != null} />
                                    <RHFTextField name="fullname" label="Họ và tên" />
                                    <RHFTextField name="email" label="Email" />
                                    <FormControlLabel checked={isAdmin} onChange={() => { setIsAdmin((prev) => !prev) }} control={<IOSSwitch sx={{ mr: 2 }} />} label="Quyền quản trị" />
                                    {
                                        account.id &&
                                        <Box>
                                            <Chip label={account.accountStatus.description} color={account.accountStatus.color} />
                                        </Box>
                                    }
                                    <Stack direction={"row"} justifyContent="space-between" >
                                        <Stack direction={"row"} spacing={1}>
                                            {
                                                account.id && account.accountStatus.name === 'ACTIVE' &&
                                                <Button variant="outlined" color="error" onClick={() => { handleSetAccountStatus('INACTIVE') }}>Hủy Kích Hoạt</Button>
                                            }
                                            {
                                                account.id && account.accountStatus.name !== 'ACTIVE' &&
                                                <Button variant="outlined" color="warning" onClick={() => { handleSetAccountStatus('ACTIVE') }}>Tái Kích Hoạt</Button>
                                            }

                                            {
                                                account.id && account.username &&
                                                <Button variant="outlined" color="info" onClick={handleResetPassword}>Cài Lại Mật Khẩu</Button>
                                            }
                                        </Stack>
                                        <Box>
                                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                                Xác Nhận
                                            </LoadingButton>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </FormProvider>
                        </Container>
                    </Box>
                </Box>
            </Paper>

            {
                account.customerInfos != null && Object.keys(account.customerInfos).length !== 0 &&
                <Paper elevation={3} square>
                    <Box p={{ xs: 1, md: 3 }}>
                        <Box>
                            <Grid container justifyContent={"center"} pb={1} alignItems="center">
                                <Typography variant="h4" align='center' color={"gray"}>
                                    Địa Chỉ Đã Lưu
                                </Typography>
                            </Grid>
                        </Box>
                        <Stack spacing={3} p={3}>
                            {
                                Object.values(account.customerInfos).map(address => (
                                    <Grid container key={address.id} justifyContent={"center"}>
                                        <Grid item lg={8} xs={12}>
                                            <Stack className={"border-bottom"}>
                                                <Typography variant="h6" gutterBottom>
                                                    {address.fullname}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {address.phone}
                                                </Typography>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    {`${address.address}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Stack>
                    </Box>
                </Paper>
            }
        </Stack>
        <Dialog
            maxWidth={"sm"}
            onClose={() => { setPassword(null) }}
            open={password != null}
            TransitionComponent={Transition}>
            <DialogTitle>Đã đặt lại mật khẩu</DialogTitle>
            <DialogContent>
                <Typography variant='body1'>
                    Mật khẩu mới là :
                </Typography>
                <Typography variant='body1' color={"crimson"} textAlign={"center"}>
                    {password}
                </Typography>
            </DialogContent>
        </Dialog>
    </>)
}

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

const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});