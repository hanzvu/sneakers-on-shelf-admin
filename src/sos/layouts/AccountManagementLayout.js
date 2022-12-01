import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function AccountManagementLayout() {

    return (<>
        <Page title="Quản Lý Tài Khoản">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}