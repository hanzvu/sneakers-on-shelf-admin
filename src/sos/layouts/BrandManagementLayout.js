import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function BrandManagementLayout() {

    return (<>
        <Page title="Quản Lý Nhãn Hiệu">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}