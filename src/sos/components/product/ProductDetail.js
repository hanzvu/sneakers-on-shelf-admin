import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { findProduct } from '../../services/ProductService';
import ProductDetailForm from './ProductDetailForm';
import { getAllBrand, getAllCategory } from '../../services/CollectionService';
import { ProductSize } from './ProductSize';
import ProductImages from './ProductImages';
import { findColors } from '../../services/ColorService';
import { findMaterials } from '../../services/MaterialService';
import { findSoles } from '../../services/SoleService';

export default function ProductDetail() {

    const params = useParams();

    const [data, setData] = useState();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const brands = await getAllBrand();
        const categories = await getAllCategory();
        const colors = await findColors({ status: 'ACTIVE', page: 1, size: 100 });
        const materials = await findMaterials({ status: 'ACTIVE', page: 1, size: 100 });
        const soles = await findSoles({ status: 'ACTIVE', page: 1, size: 100 });

        const product = params.id === 'new' ? {
            name: '',
            sellPrice: 0,
            description: '',
            category: null,
            brand: null,
            color: null,
            material: null,
            sole: null,
            productStatus: {
                name: "ACTIVE"
            },
            productGender: {
                name: "MEN",
            },
            shoeHeight: {
                name: 'LOW_TOP'
            },
            benefit: {
                name: 'NEUTRAL'
            },
            shoeFeel: {
                name: 'NEUTRAL'
            },
            surface: {
                name: 'NEUTRAL'
            }
        } : await findProduct(params.id);

        setData({ brands, categories, colors, materials, soles, product });
    }

    const fetchProductData = async () => {
        const product = params.id === 'new' ? {
            name: '',
            sellPrice: 0,
            description: '',
            brand: null,
            category: null,
            color: null,
            material: null,
            sole: null,
            productStatus: {
                name: "ACTIVE"
            },
            productGender: {
                name: "MEN",
            },
            shoeHeight: {
                name: 'LOW_TOP'
            },
            benefit: {
                name: 'NEUTRAL'
            },
            shoeFeel: {
                name: 'NEUTRAL'
            },
            surface: {
                name: 'NEUTRAL'
            }
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