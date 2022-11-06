import React from "react";
const pagination = ({products, loading}) => {
    if(loading ){
        return <h2>.. loading</h2>
    }

    return <ul className='list-group mb-4'>
        {products.map(product =>(
            <li key={product.id} className='list-group-item'>
                    
            </li>
        ))}
    </ul>
}