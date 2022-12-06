import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function MaterialManagementLayout() {

    return (<>
        <Page title="Quản Lý Vật Liệu">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}