import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function SoleManagementLayout() {

    return (<>
        <Page title="Quản Lý Đế Giày">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}