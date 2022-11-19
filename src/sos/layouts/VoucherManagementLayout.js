import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function VoucherManagementLayout() {

    return (<>
        <Page title="Quản Lý Mã Giảm Giá">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}