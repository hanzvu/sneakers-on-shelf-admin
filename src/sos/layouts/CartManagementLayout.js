import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function CartManagementLayout() {

    return (<>
        <Page title="Quản Lý Giỏ Hàng">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}