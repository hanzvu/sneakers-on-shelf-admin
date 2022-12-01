import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { createProduct } from '../../services/ProductService';
import { showSnackbar } from '../../services/NotificationService';

export default function ProductDetailForm({ data, fetchData }) {

    const navigate = useNavigate();

    const [input, setInput] = useState(data.product);

    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên sản phẩm.'),
        sellPrice: Yup.number().typeError('Số tiền không hợp lệ.').required('Vui lòng nhập giá sản phẩm.').min(1, "Giá sản phẩm phải lớn hơn 0."),
    });

    const defaultValues = {
        name: data.product.name ? data.product.name : '',
        sellPrice: data.product.sellPrice ? Number(data.product.sellPrice) : 0,
        description: data.product.description ? data.product.description : '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (formInput) => {
        if (input.brand == null || input.brand.id == null) {
            showSnackbar('Bạn chưa chọn nhãn hiệu.', 'error')
            return;
        }

        if (input.category == null || input.category.id == null) {
            showSnackbar('Bạn chưa chọn danh mục.', 'error')
            return;
        }

        createProduct({
            ...formInput,
            id: data.product.id,
            brand: {
                id: input.brand.id
            },
            category: {
                id: input.category.id
            },
            productStatus: input.productStatus.name,
            productGender: input.productGender.name
        }).then(created => {
            if (data.product.id) {
                showSnackbar('Cập nhật sản phẩm thành công.');
                fetchData();
            } else {
                showSnackbar('Thêm sản phẩm thành công.');
                navigate(`/dashboard/products/${created.id}`);
            }
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        })
    }

    return (<>
        <Paper elevation={3} square>
            <Box p={{ xs: 1, md: 3 }}>
                <Box>
                    <Grid container justifyContent={"center"} pb={1} alignItems="center">
                        <Typography variant="h4" align='center' color={"gray"}>
                            {data.product.id != null ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm'}
                        </Typography>
                    </Grid>
                    <Container maxWidth="md">
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={3} p={3}>
                                <RHFTextField name="name" label="Tên sản phẩm" />
                                <RHFTextField name="description" label="Mô tả" multiline minRows={2} />
                                <Container disableGutters>
                                    <Grid container spacing={2} justifyContent={"center"}>
                                        <Grid item md={4}>
                                            <RHFTextField name="sellPrice" label="Giá" type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]', min: 0 }} />
                                        </Grid>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Trạng Thái</InputLabel>
                                                <Select value={input.productStatus.name}
                                                    onChange={e => { setInput({ ...input, productStatus: { name: e.target.value } }) }}
                                                    label="Trạng Thái">
                                                    <MenuItem value={'ACTIVE'}>Kinh doanh</MenuItem>
                                                    <MenuItem value={'SUSPENSION'}>Ngừng kinh doanh</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Container>
                                <Container disableGutters>
                                    <Grid container spacing={2}>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Thương Hiệu</InputLabel>
                                                <Select
                                                    value={input.brand.id}
                                                    label="Thương Hiệu"
                                                    onChange={event => { setInput({ ...input, brand: { id: event.target.value } }) }}
                                                >
                                                    {
                                                        data.brands.map(brand => (
                                                            <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Danh Mục</InputLabel>
                                                <Select
                                                    value={input.category.id}
                                                    label="Danh Mục"
                                                    onChange={event => { setInput({ ...input, category: { id: event.target.value } }) }}
                                                >
                                                    {
                                                        data.categories.map(category => (
                                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Giới Tính</InputLabel>
                                                <Select
                                                    value={input.productGender.name}
                                                    label="Giới Tính"
                                                    onChange={event => { setInput({ ...input, productGender: { name: event.target.value } }) }}
                                                >
                                                    <MenuItem value={'MEN'}>Nam</MenuItem>
                                                    <MenuItem value={'WOMAN'}>Nữ</MenuItem>
                                                    <MenuItem value={'UNISEX'}>Unisex</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Container>
                                <Stack direction={"row"} justifyContent="flex-end" >
                                    <Box>
                                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                            Xác Nhận
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Stack>
                        </FormProvider>
                    </Container>
                </Box>
            </Box>
        </Paper>

    </>)
}
