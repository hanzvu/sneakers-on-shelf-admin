import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function OrderManagementLayout() {

    return (<>
        <Page title="Quản Lý Đơn Hàng">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}