import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

// components
import Button from 'react-bootstrap/Button';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon,
  MDBRadio
}
  from 'mdb-react-ui-kit';
import Form from 'react-bootstrap/Form';

// ----------------------------------------------------------------------

function FromUpdate() {

  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [productGender, setProductGender] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [idBrand, setIdBrand] = useState("");
  const [idCategory, setIdCategory] = useState("");
  const [nameBrand, setNameBrand] = useState("");
  const [ImportPrice, setImportPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


// call api brand
const [brands, setBrands] = useState([]);
const fetchBrand = async () => {
  const { data } = await Axios.get(
    "http://localhost:8080/admin/v1/brands"
  );

  const brands = data;
  setBrands(brands);
  console.log(brands);
};

useEffect(() => {
  fetchBrand();
}, []);

const handleChangeBrand = event => {
  console.log(event.target.value);
  setIdBrand(event.target.value)
  console.log("idBrand");
  console.log(idBrand);
};

// call api category
const [categorys, setCategorys] = useState([]);
const fetchCategory = async () => {
  const { data } = await Axios.get(
    "http://localhost:8080/admin/v1/categories"
  );

  const categorys = data;
  setCategorys(categorys);
  console.log(categorys);
};

useEffect(() => {
  fetchCategory();
}, []);

const handleChangeCategory = event => {
  console.log(event.target.value);

};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/content/v1/products/save", {
        method: "POST",
        headers: {
          Prefer: 'params=single-object',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'charset': 'UTF-8'
        },
        body: JSON.stringify({
          "name": nameProduct,
          "productGender": productGender,
          "brand": {
            "id": idBrand
          },
          "category": {
            "id": idCategory
          },
          "productImage": {
            "id": 1,
            "image": "https://bizweb.dktcdn.net/thumb/1024x1024/100/413/756/products/dq2514-100-01-1661750899934.png?v=1661750906003"
          },
          "productDetails": [],
          "sellPrice": sellPrice,
          "originalPrice": originalPrice,
          "importPrice": ImportPrice,
          "description": description,
          "createDate": null,
          "updateDate": null

        }
        ),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (

    <Form onSubmit={handleSubmit}>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Name'
            value={nameProduct}
            onChange={(e) => setNameProduct(e.target.value)}
            id='form1'
            type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Original Price'
            value={originalPrice}
            id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          Brand
          <select onChange={handleChangeBrand} name="fruits" id="fruit-select">
            {brands.map((option, index) => (
              <option key={index} onChange={(e) =>  setIdBrand(e.target.value)} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </MDBCol>

        <MDBCol col='6'>
          category
          <select onChange={handleChangeCategory} name="fruits" id="fruit-select">
            {categorys.map((option, index) => (
              <option key={index} onChange={(e) => setIdCategory(e.target.value)} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4'
            label='Sell Price'
            value={sellPrice}
            id='form1' type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Import Price'
            value={ImportPrice}
            id='form1'
            type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            wrapperClass='mb-4' label='Description' id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>

        <div>
          <MDBRadio name='flexRadioDefault' onChange={(e) => setProductGender(e.target.value)} value={'MEN'} id='flexRadioDefault1' label='Male' />
          <MDBRadio name='flexRadioDefault' onChange={(e) => setProductGender(e.target.value)} value={'UNISEX'} id='flexRadioDefault1' label='Unisex' />
          <MDBRadio name='flexRadioDefault' onChange={(e) => setProductGender(e.target.value)} value={'WOMAN'} id='flexRadioDefault2' label='Woman' defaultChecked />
        </div>
      </MDBRow>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default FromUpdate;