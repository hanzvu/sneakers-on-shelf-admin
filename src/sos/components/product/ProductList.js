import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Button,
    Typography,
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Pagination,
    PaginationItem,
    TableHead,
    Chip,
    TextField,
    Grid,
    Avatar,
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
import Iconify from "../../../components/Iconify";
import { fCurrency } from "../../../utils/formatNumber";
import CollectionSorter from "../common/CollectionSorter";
import { findProducts } from "../../services/ProductService";
import { getAllBrand, getAllCategory } from "../../services/CollectionService";

export default function ProductList() {

    const navigate = useNavigate();

    const [data, setData] = useState();

    const [sorter, setSorter] = useState();

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchBrandsCategories();
    }, [])

    useEffect(() => {
        fetchData();
    }, [searchParams])

    const fetchData = async () => {
        const products = await findProducts(Object.fromEntries(searchParams.entries()));
        setData({ ...data, products });
    }

    const fetchBrandsCategories = async () => {
        const brands = await getAllBrand();
        const categories = await getAllCategory();
        setSorter({ ...sorter, brands: convertToSorterData(brands), categories: convertToSorterData(categories) })
    }

    const handleSubmitQuery = (e) => {
        e.preventDefault();
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            query
        })
    }

    const handleRefresh = () => {
        setQuery('');
        setSearchParams({});
    }

    const convertToSorterData = source => {
        const rs = source.reduce((obj, row) => {
            obj[row.id] = {
                value: row.id,
                label: row.name
            };
            return obj;
        }, {});

        return {
            '': { value: '', label: 'Tất cả' },
            ...rs
        }
    }

    return (<>
        {data &&
            data &&
            <Card>
                <form onSubmit={handleSubmitQuery}>
                    <Grid container spacing={2} p={3} justifyContent={"space-between"}>
                        <Grid item md={6}>
                            <Stack direction={"row"} spacing={1}>
                                <TextField id="outlined-basic" label="Tìm Kiếm" variant="outlined" size="small" value={query} onChange={e => { setQuery(e.target.value) }} />
                                <Button variant="contained" color="primary" type="submit">Tìm Kiếm</Button>
                                <Button variant="contained" color="warning" type="button" onClick={handleRefresh}>Làm Mới</Button>
                            </Stack>
                        </Grid>
                        <Grid item md={6}>
                            <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                                <Link to={"/dashboard/products/new"} className="text-decoration-none">
                                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                        Tạo sản phẩm
                                    </Button>
                                </Link>
                            </Stack>
                        </Grid>
                        <Grid item container justifyContent={"flex-end"}>
                            <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                                {
                                    sorter && <>
                                        <CollectionSorter value={searchParams.get('category')}
                                            title="Danh Mục"
                                            defaultValue="Tất cả"
                                            handleChange={category => {
                                                setSearchParams({
                                                    ...Object.fromEntries(searchParams.entries()),
                                                    category
                                                })
                                            }}
                                            options={sorter.categories}
                                        />
                                        <CollectionSorter value={searchParams.get('brand')}
                                            title="Hãng"
                                            defaultValue="Tất cả"
                                            handleChange={brand => {
                                                setSearchParams({
                                                    ...Object.fromEntries(searchParams.entries()),
                                                    brand
                                                })
                                            }}
                                            options={sorter.brands}
                                        />
                                    </>
                                }
                                <CollectionSorter value={searchParams.get('gender')}
                                    title="Giới tính"
                                    defaultValue="Tất cả"
                                    handleChange={gender => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            gender
                                        })
                                    }}
                                    options={PRODUCT_GENDER_OPTIONS}
                                />
                                <CollectionSorter value={searchParams.get('status')}
                                    title="Trạng thái"
                                    defaultValue="Tất cả"
                                    handleChange={status => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            status
                                        })
                                    }}
                                    options={PRODUCT_STATUS_OPTIONS}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width={"20%"}>Ảnh</TableCell>
                                    <TableCell align="center">Tên Sản Phẩm</TableCell>
                                    <TableCell align="center">Giá</TableCell>
                                    <TableCell align="center">Ngày Tạo</TableCell>
                                    <TableCell align="center">Giới Tính</TableCell>
                                    <TableCell align="center">Trạng Thái</TableCell>
                                    <TableCell align="center" width={"13%"}>Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    data.products.content && data.products.content.map(product => (
                                        <TableRow
                                            hover
                                            key={product.id}
                                            tabIndex={-1}
                                            role="checkbox">
                                            <TableCell align="center">
                                                <Link to={`/dashboard/products/${product.id}`}>
                                                    <img alt={product.name} src={product.image} className="img-fluid" />
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {product.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" color="crimson">
                                                    {fCurrency(product.sellPrice)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" flexWrap>
                                                    {new Date(product.createDate).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={product.productGender.description} color={product.productGender.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={product.productStatus.description} color={product.productStatus.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link to={`/dashboard/products/${product.id}`} className="text-decoration-none">
                                                    <Button variant="outlined">Chi Tiết</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                {
                                    data.products.content.length === 0 &&
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

                <Stack alignItems={"center"} spacing={3} py={2}>
                    <Pagination
                        page={data.products.number + 1}
                        count={data.products.totalPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`/dashboard/products${item.page === data.products.number + 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </Card>
        }
    </>);
}

const PRODUCT_STATUS_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'SUSPENSION': { value: 'SUSPENSION', label: 'Ngừng kinh doanh' },
    'ACTIVE': { value: 'ACTIVE', label: 'Kinh doanh' },
}

const PRODUCT_GENDER_OPTIONS = {
    '': { value: '', label: 'Tất cả' },
    'MEN': { value: 'MEN', label: 'Nam' },
    'WOMAN': { value: 'WOMAN', label: 'Nữ' },
    'UNISEX': { value: 'UNISEX', label: 'Unisex' },
}