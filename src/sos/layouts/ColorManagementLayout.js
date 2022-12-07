import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function ColorManagementLayout() {

    return (<>
        <Page title="Quản Lý Màu Sắc">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}