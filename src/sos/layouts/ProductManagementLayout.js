import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function ProductManagementLayout() {

    return (<>
        <Page title="Quản Lý Sản Phẩm">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}