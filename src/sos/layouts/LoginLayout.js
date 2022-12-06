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
    paddingTop: 100
}));

export default function LoginLayout() {


    return (<>
        <Page title="Login">
            <RootStyle>
                <Container maxWidth="sm">
                    <ContentStyle>
                        <Typography variant="h4" textAlign={"center"} py={2}>
                            ĐĂNG NHẬP
                        </Typography>
                        <AuthSocial />

                        <LoginForm />
                    </ContentStyle>
                </Container>
            </RootStyle>
        </Page>
    </>)
}