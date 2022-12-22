import { Grid, Stack, Typography } from "@mui/material";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Incrementer from "./Incrementer";

export default function ProductDetailSizeList({ productDetails, handleSelectProductDetail }) {

    const [selectedProduct, setSelectedProduct] = useState(productDetails[0]);
    const [quantity, setQuantity] = useState(1);


    const handleAddToCartSubmit = () => {
        handleSelectProductDetail({ id: selectedProduct.id, quantity })
    }

    const handleChangeQuantity = value => {
        if (value <= selectedProduct.quantity && value >= 1 && Number.isInteger(Number(value))) {
            setQuantity(value)
        }
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    return (<>
        <div className="py-1 text-center">Size</div>
        <Grid container spacing={1} justifyContent={"center"}>
            {
                productDetails.map((pd, i) => (
                    <Grid item key={pd.id} gridAutoColumns>
                        <button
                            className={`d-block shadow-none btn rounded-0 ${pd.id === selectedProduct.id ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedProduct(productDetails[i])}>
                            {pd.size}
                        </button>
                    </Grid>
                ))
            }
        </Grid>
        <Stack pt={2} alignItems="center" justifyContent="space-between">
            <Incrementer
                name="quantity"
                quantity={quantity}
                available={selectedProduct.quantity}
                onChangeQuantity={event => handleChangeQuantity(event.target.value)}
                onIncrementQuantity={() => handleChangeQuantity(quantity + 1)}
                onDecrementQuantity={() => handleChangeQuantity(quantity - 1)} />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
                {selectedProduct.quantity} sản phẩm có sẵn
            </Typography>
        </Stack>
        <div className="d-flex justify-content-center py-3">
            {
                selectedProduct.quantity > 0 &&
                <Stack direction="row" spacing={1}>
                    <button type="submit" className="btn btn-dark shadow-none rounded-0 border-dark" onClick={handleAddToCartSubmit}>
                        THÊM VÀO GIỎ
                    </button>
                </Stack>
            }
        </div>
    </>)
}
