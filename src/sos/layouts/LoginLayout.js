import { Container, Link, styled, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import Page from "../../components/Page";
import AuthSocial from "../components/login/AuthSocial";
import LoginForm from "../components/login/LoginForm";


const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
}));

export default function LoginLayout() {


    return (<>
        <Page title="Login">
            <RootStyle>
                <Container maxWidth="sm">
                    <ContentStyle>
                        <Typography variant="h4" textAlign={"center"} gutterBottom>
                            ĐĂNG NHẬP
                        </Typography>
                        <AuthSocial />

                        <LoginForm />

                        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                            Bạn chưa có tài khoản ?{' '}
                            <Link variant="subtitle2" component={RouterLink} to="/register">
                                Đăng ký ngay
                            </Link>
                        </Typography>
                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page>
    </>)
}