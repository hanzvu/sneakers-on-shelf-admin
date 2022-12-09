import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
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

        if (input.color == null || input.color.id == null) {
            showSnackbar('Bạn chưa chọn màu sản phẩm.', 'error')
            return;
        }

        if (input.sole == null || input.sole.id == null) {
            showSnackbar('Bạn chưa chọn đế sản phẩm.', 'error')
            return;
        }

        if (input.material == null || input.material.id == null) {
            showSnackbar('Bạn chưa chọn chất liệu sản phẩm.', 'error')
            return;
        }

        if (input.shoeHeight == null || input.shoeHeight.name == null) {
            showSnackbar('Bạn chưa chọn chiều cao giày.', 'error')
            return;
        }

        if (input.benefit == null || input.benefit.name == null) {
            showSnackbar('Bạn chưa chọn thời tiết thích hợp cho sản phẩm.', 'error')
            return;
        }

        if (input.shoeFeel == null || input.shoeFeel.name == null) {
            showSnackbar('Bạn chưa chọn cảm giác đi giày.', 'error')
            return;
        }

        if (input.surface == null || input.surface.name == null) {
            showSnackbar('Bạn chưa chọn môi trường thích hợp cho giày.', 'error')
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
            color: {
                id: input.color.id
            },
            sole: {
                id: input.sole.id
            },
            material: {
                id: input.material.id
            },
            productStatus: input.productStatus.name,
            productGender: input.productGender.name,
            shoeHeight: input.shoeHeight.name,
            benefit: input.benefit.name,
            shoeFeel: input.shoeFeel.name,
            surface: input.surface.name,
        }).then(created => {
            if (data.product.id) {
                showSnackbar('Cập nhật sản phẩm thành công.');
                fetchData();
            } else {
                showSnackbar('Thêm sản phẩm thành công.');
                navigate(`/dashboard/products/${created.id}`);
                window.location.reload();
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
                            {data.product.id != null ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM'}
                        </Typography>
                    </Grid>
                    <Container maxWidth="md">
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={4} p={3}>
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
                                                    value={input.brand ? input.brand.id : null}
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
                                                    value={input.category ? input.category.id : null}
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
                                <Container disableGutters>
                                    <Grid container spacing={2}>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Màu Sắc</InputLabel>
                                                <Select
                                                    value={input.color ? input.color.id : null}
                                                    label="Màu Sắc"
                                                    onChange={event => { setInput({ ...input, color: { id: event.target.value } }) }}
                                                >
                                                    {
                                                        data.colors.content.map(color => (
                                                            <MenuItem key={color.id} value={color.id}><SquareIcon style={{ fill: color.code }} />
                                                                {color.code}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Đế Giày</InputLabel>
                                                <Select
                                                    value={input.sole ? input.sole.id : null}
                                                    label="Đế Giày"
                                                    onChange={event => { setInput({ ...input, sole: { id: event.target.value } }) }}
                                                >
                                                    {
                                                        data.soles.content.map(sole => (
                                                            <MenuItem key={sole.id} value={sole.id}>
                                                                {sole.name}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Chất Liệu</InputLabel>
                                                <Select
                                                    value={input.material ? input.material.id : null}
                                                    label="Chất Liệu"
                                                    onChange={event => { setInput({ ...input, material: { id: event.target.value } }) }}
                                                >
                                                    {
                                                        data.materials.content.map(material => (
                                                            <MenuItem key={material.id} value={material.id}>
                                                                {material.name}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Container>
                                <Container disableGutters>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Độ Cao Giày</InputLabel>
                                                <Select
                                                    value={input.shoeHeight ? input.shoeHeight.name : null}
                                                    label="Độ Cao Giày"
                                                    onChange={event => { setInput({ ...input, shoeHeight: { name: event.target.value } }) }}
                                                >
                                                    {
                                                        SHOE_HEIGHT.map(entity => (
                                                            <MenuItem key={entity.name} value={entity.name}>
                                                                {entity.description}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Cảm Giác</InputLabel>
                                                <Select
                                                    value={input.shoeFeel ? input.shoeFeel.name : null}
                                                    label="Cảm Giác"
                                                    onChange={event => { setInput({ ...input, shoeFeel: { name: event.target.value } }) }}
                                                >
                                                    {
                                                        SHOE_FEEL.map(entity => (
                                                            <MenuItem key={entity.name} value={entity.name}>
                                                                {entity.description}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Địa Hình</InputLabel>
                                                <Select
                                                    value={input.surface ? input.surface.name : null}
                                                    label="Địa Hình"
                                                    onChange={event => { setInput({ ...input, surface: { name: event.target.value } }) }}
                                                >
                                                    {
                                                        SURFACE.map(entity => (
                                                            <MenuItem key={entity.name} value={entity.name}>
                                                                {entity.description}
                                                            </MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl fullWidth>
                                                <InputLabel>Thời Tiết Thích Hợp</InputLabel>
                                                <Select
                                                    value={input.benefit ? input.benefit.name : null}
                                                    label="Thời Tiết Thích Hợp"
                                                    onChange={event => { setInput({ ...input, benefit: { name: event.target.value } }) }}
                                                >
                                                    {
                                                        BENEFIT.map(entity => (
                                                            <MenuItem key={entity.name} value={entity.name}>
                                                                {entity.description}
                                                            </MenuItem>
                                                        ))
                                                    }
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

const SHOE_HEIGHT = [
    { name: 'LOW_TOP', description: 'Cổ Thấp' },
    { name: 'MID_TOP', description: 'Cổ Vừa' },
    { name: 'HIGH_TOP', description: 'Cổ Cao' }
]

const BENEFIT = [
    { name: 'NEUTRAL', description: 'Tất cả' },
    { name: 'WARM', description: 'Thời tiết ấm áp' },
    { name: 'COLD', description: 'Thời tiết lạnh' },
    { name: 'HUMID', description: 'Thời tiết ẩm ướt' },
]

const SHOE_FEEL = [
    { name: 'NEUTRAL', description: 'Ổn định' },
    { name: 'FLEXIBLE', description: 'Thoải mái linh hoạt' },
    { name: 'SRPINGY', description: 'Co dãn đàn hồi' },
    { name: 'SOFT', description: 'Mềm mại' },
]

const SURFACE = [
    { name: 'NEUTRAL', description: 'Tất cả' },
    { name: 'FIRM', description: 'Kiên cố' },
    { name: 'HARD_COURT', description: 'Sân cứng' },
    { name: 'INDOOR_COURT', description: 'Sân đấu trong nhà' },
    { name: 'ROAD', description: 'Đường' },
    { name: 'TRAIL', description: 'Đường mòn' },
    { name: 'TURF', description: 'Sân cỏ' },
]