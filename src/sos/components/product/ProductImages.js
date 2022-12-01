import { useState, useEffect } from "react";
import { Box, ImageList, ImageListItem, Paper, ImageListItemBar, IconButton, Tooltip, Container, Grid, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../../../components/Iconify";
import { deleteProductImage, findProductImagesByProductId, setDefaultProductImage, uploadProductImage } from "../../services/ProductImageService";
import { showSnackbar } from "../../services/NotificationService";

export default function ProductImages({ product, fetchProduct }) {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        findProductImagesByProductId(product.id).then(data => {
            setData(data);
        })
    }

    const handleUploadImage = (e) => {
        setLoading(true);
        uploadProductImage(product.id, e.target.files[0]).then(() => {
            fetchProduct();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleSetDefaultProductImage = id => {
        setDefaultProductImage(id).then(() => {
            fetchProduct();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        });
    }

    const handleDeleteProductImage = id => {
        deleteProductImage(id).then(() => {
            fetchData();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                showSnackbar(error.response.data, 'error')
            } else {
                showSnackbar('Có lỗi xảy ra, hãy thử lại sau.', 'error')
            }
        });
    }

    if (data == null) {
        return;
    }

    return (<>
        <Paper elevation={3} square>
            <Box p={{ xs: 1, md: 3 }}>
                <Grid container>
                    <ImageList cols={4}>
                        {
                            data.map(productImage => (
                                <ImageListItem key={productImage.id}>
                                    <img
                                        src={productImage.image}
                                        srcSet={productImage.image}
                                        alt={productImage.id}
                                        loading="lazy" />
                                    <ImageListItemBar
                                        sx={{
                                            background: "transparent",
                                            top: "3%",
                                            "& .MuiImageListItemBar-titleWrap": {
                                                flexGrow: 0,
                                                padding: 0
                                            },
                                            "& .MuiImageListItemBar-actionIcon": {
                                                flexGrow: 1
                                            }
                                        }}
                                        position="top"
                                        actionIcon={
                                            <>
                                                <Grid container justifyContent={"space-between"}>
                                                    {
                                                        (product.productImage && product.productImage.id === productImage.id) ?
                                                            <Tooltip title="Ảnh mặc định">
                                                                <IconButton
                                                                    sx={{ color: 'white' }}
                                                                    aria-label={`star`}>
                                                                    <Iconify icon={"ic:baseline-star-rate"} color="gold" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="Đặt làm mặc định">
                                                                <IconButton
                                                                    sx={{ color: 'white' }}
                                                                    aria-label={`star`}
                                                                    onClick={() => { handleSetDefaultProductImage(productImage.id) }}>
                                                                    <Iconify icon={"ic:baseline-star-outline"} color="gold" />
                                                                </IconButton>
                                                            </Tooltip>
                                                    }
                                                    {
                                                        (product.productImage && product.productImage.id !== productImage.id) &&
                                                        <Tooltip title="Xóa">
                                                            <IconButton
                                                                sx={{ color: 'white' }}
                                                                aria-label={`star`}
                                                                onClick={() => { handleDeleteProductImage(productImage.id) }}>
                                                                <Iconify icon={"ic:round-delete-forever"} color="darkred" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </Grid>
                                            </>
                                        }
                                        actionPosition="right"
                                    />
                                </ImageListItem>
                            ))
                        }
                    </ImageList>
                    <Grid item container justifyContent="center">
                        <LoadingButton variant="contained" size="large" component="label" startIcon={<Iconify icon={"ic:outline-drive-folder-upload"} />} loading={loading}>
                            Thêm Ảnh
                            <input hidden accept="image/*" multiple type="file" onChange={handleUploadImage} />
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    </>)
}