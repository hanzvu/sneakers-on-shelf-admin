import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function CategoryManagementLayout() {

    return (<>
        <Page title="Quản Lý Danh Mục">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}