import { useState, useEffect } from 'react';
import Axios from "axios";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { FaBeer,FaTrashAlt,FaEdit } from 'react-icons/fa';
// eslint-disable-next-line import/no-unresolved
import Page from 'src/components/Page';
// eslint-disable-next-line import/no-unresolved
import Iconify from 'src/components/Iconify';
// material
import {
  Card,

  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
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
// components
import { listProducts } from '../api/product';

import { getAll,deleteProductById, updateProductById } from '../services/ProductService'
// ----------------------------------------------------------------------
function ProductManager() {

  const brandKey = {
    id: '',
    name: ''
  };

  const categoryKey = {
    id: '',
    name: ''
  };


  const initialFormState = {
    name: '',
    productGender: '',
    brand: brandKey,
    category: categoryKey,
    sellPrice: '',
    originalPrice: '',
    importPrice: '',
    description: ''
  }
  const [productGender, setProductGender] = useState("");
  const [productKey, setProductKey] = useState(initialFormState);

  // call api brand
  const [brands, setBrands] = useState([]);
  const fetchBrand = async () => {
    const { data } = await Axios.get(
        "http://localhost:8080/api/v1/brands"
    );

    const brands = data;
    setBrands(brands);
    console.log(brands);
  };

  useEffect(() => {
    fetchBrand();
  }, []);


  // call api category
  const [categorys, setCategorys] = useState([]);
  const fetchCategory = async () => {
    const { data } = await Axios.get(
        "http://localhost:8080/api/v1/categories"
    );
    const categorys = data;
    setCategorys(categorys);
    console.log(categorys);

  };
  useEffect(() => {
    fetchCategory();
  }, []);


// and category
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/content/v1/products/updated", {
        method: "POST",
        headers: {
          Prefer: 'params=single-object',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'charset': 'UTF-8'
        },
        body: JSON.stringify(productKey),
      });
      const resJson = await res.json();
      if (resJson.code === 400) {
        toast(resJson.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast("Product update successfully", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setLoading()
    } catch (err) {
      console.log(err);
    }
  };
  // list product

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(null);

  const fetchProducts = async () => {
    const { data } = await getAll()
    const products = data;
    setProducts(products);
    console.log(products);
    setLoading()
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [idProduct, setIdProduct] = useState('');
  // const setProduct([...products, product])
  const data = {
    code: '',
    message: ''
  };

  const [messageDelete, setMessageDelete] = useState(data);
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
    deleteProductById(id).then((res) => {
      setMessageDelete(res.data)
    })

    if (messageDelete.code === 400) {
      console.log(400)
      toast(messageDelete.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast("Product delete successfully", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

  }


  const [productEdit, setProductEdit] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => {
    fetchProducts()
    setShow(false);
  }
  const handleShow = () =>setShow(true);
  const handleEdit = (product) => {
    handleShow(true);

    setProductKey(product);
  };
  const handleInputChange = event => {
    const { name, value } = event.target
    setProductKey({ ...productKey,
      [name]: value
    })
  }
  /// product detail

  const [modalShow, setModalShow] = useState(false);
  const [proDetai, setProDetai] = useState({});
  const [productDetails, setProductDetails] = useState([]);
  const showProductDetail = async(item,bool) => {
    console.log("doubleclick: ")
    setProDetai(item)
    const  {data} = await Axios.get(
        `http://localhost:8080/api/v1/productDetails/${item.id}`
    );
    const products = data;
    console.log("data: ")
    console.log(products)
    setProductDetails(products)
    setModalShow(bool)
  }
  useEffect(() => {
    showProductDetail();
  }, []);

  function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Thông tin chi tiết
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              {productDetails.map((item, index) => (
                  <tr key={index}>
                    <td value={item.name}>Size: {item.size} số lượng: {item.quantity}</td>
                  </tr>
              ))}
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
  }
  return (
      <Page title="Product Manager">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Product Manager
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              <a className="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root"
                 tabIndex="0" href="/dashboard/productCreate" style={{ textDecoration: 'none', color: 'white' }}>
                New Product
              </a>
            </Button>
          </Stack>
          <Card >

            <TableContainer sx={{ minWidth: 800 }}>
              <Table striped bordered hover>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>SellPrice</th>
                  <th>OriginalPrice</th>
                  <th>ImportPrice</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th rowSpan={2}>Acction</th>
                </tr>
                </thead>
                <tbody>
                {products.map((item, index) => (
                    <tr key={index} onDoubleClick={() =>showProductDetail(item,true)}>
                      <td value={item.name}>{item.name}</td>
                      <td value={item.productGender}>{item.productGender}</td>
                      <td value={item.brand}>{item.brand!== null?item.brand.name:""}</td>
                      <td value={item.category}>{item.category !== null?item.category.name:""}</td>
                      <td value={item.sellPrice}>{item.sellPrice}</td>
                      <td value={item.originalPrice}>{item.originalPrice}</td>
                      <td value={item.importPrice}>{item.importPrice}</td>
                      <td value={item.description}>{item.description}</td>
                      <td value={item.productImage}>
                        <img width='50px' src={item.productImage !== null? item.productImage.image: ""} alt="hello" />
                      </td>
                      <td>
                        <Button variant="outlined"
                                value={idProduct}
                                onChange={(e) => setIdProduct(item.id)}
                                onClick={() => deleteProduct(item.id)} > <FaTrashAlt /></Button>
                        <ToastContainer />
                        <Button variant="outlined"
                                onClick={() => handleEdit(item)}
                        ><FaEdit />
                        </Button>

                      </td>
                    </tr>
                ))}
                </tbody>


                <Modal show={show} onHide={handleClose}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Cập nhật sản phẩm</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <MDBRow>
                        <MDBCol col='6'>
                          <MDBInput
                              wrapperClass='mb-4'
                              label='Name'
                              name='name'
                              value={productKey.name}
                              onChange={handleInputChange}
                              id='form1'
                              type='text' />
                        </MDBCol>
                        <MDBCol col='6'>
                          <MDBInput
                              wrapperClass='mb-4'
                              label='Original Price'
                              name='originalPrice'
                              value={productKey.originalPrice}
                              onChange={handleInputChange}
                              id='form1'
                              type='number' />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol col='6'>
                          Brand
                          <select  id="fruit-select">
                            {brands.map((option, index) => (
                                <option
                                    onChange={handleInputChange}
                                    selected={productKey.brand.name === option.name }
                                    name='brand' key={index}
                                    value={option.name}>
                                  {option.name}
                                </option>
                            ))}
                          </select>
                        </MDBCol>
                        <MDBCol col='6'>
                          <MDBInput wrapperClass='mb-4'
                                    label='Sell Price'
                                    name='sellPrice'
                                    value={productKey.sellPrice}
                                    onChange={handleInputChange}
                                    id='form1' type='number' />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol col='6'>
                          category
                          <select id="fruit-select">
                            {categorys.map((option, index) => (
                                <option
                                    onChange={handleInputChange}
                                    name='category'
                                    selected={productKey.category.name === option.name }
                                    key={index}
                                    value={productKey.category}>
                                  {option.name}
                                </option>
                            ))}
                          </select>
                        </MDBCol>
                        <MDBCol col='6'>
                          <MDBInput
                              wrapperClass='mb-4'
                              label='Import Price'
                              name='importPrice'
                              value={productKey.importPrice}
                              onChange={handleInputChange}
                              id='form1'
                              type='number' />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol col='6'>
                          <MDBInput
                              name='description'
                              value={productKey.description}
                              onChange={handleInputChange}
                              wrapperClass='mb-4' label='Description' id='form1' type='text' />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <div>
                          <MDBRadio
                              onChange={handleInputChange}
                              name ='productGender'
                              defaultChecked={productKey.productGender === "MEN" }
                              value={productKey.productGender} id='flexRadioDefault1'
                              label='MEN'/>
                          <MDBRadio
                              onChange={handleInputChange}
                              name ='productGender'
                              defaultChecked={productKey.productGender === "UNISEX" }
                              value={productKey.productGender} id='flexRadioDefault1'
                              label='UNISEX'/>
                          <MDBRadio
                              onChange={handleInputChange}
                              name ='productGender'
                              defaultChecked={productKey.productGender === "WOMAN" }
                              value={productKey.productGender} id='flexRadioDefault1'
                              label='WOMAN'/>
                        </div>
                      </MDBRow>
                      <Button  variant="primary" type="submit" onClick={handleClose}>
                        update
                      </Button>
                      <ToastContainer />
                    </Form>
                  </Modal.Body>
                </Modal>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Page>

  )
}
export default ProductManager;