import { Card, Chip, IconButton, Pagination, PaginationItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import { getMemberOfferPolicies } from "../../services/CartService";

export default function MemberOfferPolicyList() {

    const [data, setData] = useState();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        getMemberOfferPolicies().then(data => { setData(data) });
    }

    return (<>
        {
            data &&
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Hạng</TableCell>
                                    <TableCell align="center">Điểm Tích Lũy Yêu Cầu</TableCell>
                                    <TableCell align="center">Ưu Đãi</TableCell>
                                    <TableCell align="center">Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.length > 0 && data.map((mop, index) => (
                                        <TableRow hover key={mop.id} tabIndex={-1}>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {index + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={mop.memberRank.description} color={mop.memberRank.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {mop.requiredPoint}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {mop.offer}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton aria-label="edit" size="medium" color="primary">
                                                        <Iconify icon="eva:edit-2-fill" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                {
                                    data.length === 0 &&
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                            <Typography gutterBottom align="center" variant="subtitle1">
                                                Không Có Dữ Liệu
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        }
    </>)

}