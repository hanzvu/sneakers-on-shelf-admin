import { Container } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Page from "../../components/Page";


export default function TransactionManagementLayout() {

    return (<>
        <Page title="Quản Lý Thu Chi">
            <Container>
                <Outlet />
            </Container>
        </Page>
    </>)
}