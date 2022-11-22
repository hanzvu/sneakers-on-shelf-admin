import { useState, useEffect } from 'react';
// @mui
import { Card, CardHeader, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import Scrollbar from '../../../components/Scrollbar';
import { getBestSellingProductStatistic } from '../../services/StatisticService';
import { fCurrency } from '../../../utils/formatNumber';
// components

export default function BestSellingProduct() {

    const [data, setData] = useState()

    useEffect(() => {
        getBestSellingProductStatistic().then(data => {
            setData(data);
        })
    }, [])

    return (<>
        <Card>
            <CardHeader title={"TOP Sản Phẩm Bán Chạy Trong Tháng"} />

            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center" width={'20%'}>Ảnh</TableCell>
                                <TableCell align="center">Tên Sản Phẩm</TableCell>
                                <TableCell align="center">Giá Bán</TableCell>
                                <TableCell align="center">Doanh Số</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                data && data.content.map(product => (
                                    <TableRow
                                        hover
                                        key={product.id}
                                        tabIndex={-1}
                                        role="checkbox">
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {product.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <img src={product.image} alt={product.name} className="img-fluid" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {product.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {fCurrency(product.sellPrice)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {product.count}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                            {
                                (data == null || data.content.length === 0) &&
                                <TableRow>
                                    <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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

    </>)
}