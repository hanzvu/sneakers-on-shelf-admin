import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function StaffManagementLayout() {

    return (<>
        <Page title="Quản Lý Nhân Viên">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}