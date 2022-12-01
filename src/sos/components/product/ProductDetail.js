import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { findProduct } from '../../services/ProductService';
import ProductDetailForm from './ProductDetailForm';
import { getAllBrand, getAllCategory } from '../../services/CollectionService';
import { ProductSize } from './ProductSize';
import ProductImages from './ProductImages';

export default function ProductDetail() {

    const params = useParams();

    const [data, setData] = useState();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const brands = await getAllBrand();
        const categories = await getAllCategory();

        const product = params.id === 'new' ? {
            name: '',
            sellPrice: 0,
            description: '',
            productStatus: {
                name: "ACTIVE"
            },
            productGender: {
                name: "MEN",
            },
            brand: {
                id: brands[0].id
            },
            category: {
                id: categories[0].id
            },
        } : await findProduct(params.id);

        setData({ brands, categories, product });
    }

    const fetchProductData = async () => {
        const product = params.id === 'new' ? {
            name: '',
            sellPrice: 0,
            description: '',
            productStatus: {
                name: "ACTIVE"
            },
            brand: {
                id: 1
            },
            category: {
                id: 1
            },
        } : await findProduct(params.id);

        setData({ ...data, product });
    }

    if (data == null) {
        return;
    }

    return (<>
        <Stack spacing={3}>
            <ProductDetailForm data={data} fetchData={fetchProductData} />
            {
                data.product.id != null &&
                <>
                    <ProductSize product={data.product} fetchData={fetchProductData} />
                    <ProductImages product={data.product} fetchProduct={fetchProductData} />
                </>
            }
        </Stack>
    </>)
}