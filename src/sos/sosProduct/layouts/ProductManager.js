import { useState, useEffect } from 'react';
import Axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrashAlt,FaEdit } from 'react-icons/fa';
// eslint-disable-next-line import/no-unresolved
import Page from 'src/components/Page';
// eslint-disable-next-line import/no-unresolved
import Iconify from 'src/components/Iconify';
import {Table} from 'antd';
// material
import {
  Card,
  Stack,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio
}
  from 'mdb-react-ui-kit';

import { Button,ButtonGroup} from 'reactstrap';
// components

import {deleteProductById, paginationProduct,findProduct} from '../services/ProductService'
import { findProducDetailByProductid } from '../services/DetailService'
import { findBrandById} from '../services/BrandService'
import { findCategoryById} from '../services/CategoryService'
// ----------------------------------------------------------------------
function ProductManager() {
  const initialFormState = {
    name: '',
    productGender: '',
    brand: {
      id: '',
      name: ''
    },
    category: {
      id: '',
      name: ''
    },
    sellPrice: '',
    originalPrice: '',
    importPrice: '',
    description: ''
  }
  const [productKey, setProductKey] = useState(initialFormState);
  const [categorys, setCategorys] = useState([]);
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
  const [totalPage,setTotal] = useState(1)
  const fetchProducts = async (page) => {
    console.log(page);
    if(page !== undefined ){
      const { data } = await paginationProduct(page)
      setProducts(data.content);
      setTotal(data.totalElements)
      setLoading()
    }
  };
  useEffect(() => {
    fetchProducts(1);
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
  const [show, setShow] = useState(false);
  const handleClose = () => {
    fetchProducts()
    setShow(false);
  }
  const handleShow = () =>setShow(true);
  const handleEdit = async (id) => {
    const { data } =  await findProduct(id);
    setProductKey(data)
    handleShow(true);
  };

  const handleInputChange = async event => {
    const { name, value } = event.target
    if(name === 'brand'){
      const { data } =  await findBrandById(value);
        setProductKey({ ...productKey,
        [name]: data
      })
    } else if(name === 'category'){
      const { data } =  await findCategoryById(value);
      setProductKey({ ...productKey,
      [name]: data
    })}
    else{
        setProductKey({ ...productKey,
        [name]: value
      })
    }
  }
  /// product detail

  const [modalShow, setModalShow] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const showProductDetail = async(id,bool) => {
    console.log("doubleclick: ")
    if(id !== undefined){
      const  {data} =  await findProducDetailByProductid(id);
      const products = data;
      console.log("data: ")
      console.log(products)
      setProductDetails(products)
      setModalShow(bool)
    }
  }
  useEffect(() => {
    showProductDetail();
  }, []);
  ///
  const colums = [
    {title: 'name',dataIndex: 'name'},
    {title: 'Gender',dataIndex: 'productGender'},
    {title: 'Brand',dataIndex: 'brand',render: ( _,{brand})=>{ return (
        <div>
          {brand.name}
        </div>
      )}},
    {title: 'Category',dataIndex: 'category',render: ( _,{category})=>{ return (
          <div>
            {category.name}
          </div>
      )}},
    {title: 'SellPrice',dataIndex: 'sellPrice'},
    {title: 'Description',dataIndex: 'description'},
    {title: 'productImage',dataIndex: 'productImage',render: ( _,{productImage})=>{ return (
        <div>
          <img width={'50px'} src={productImage.image} alt={"erro"} />
        </div>
      )}},
    {title: 'Acction',dataIndex:'id', render:(_,{id})=>{return (
        <div>
          <ButtonGroup>
            <Button size="sm" color="danger"
                    onChange={(e) => setIdProduct(id)}
                    onClick={() => deleteProduct(id)}><Iconify
                icon={'ep:delete-filled'} width={22} height={22} /></Button>
            <ToastContainer />
            <Button size="sm" color="primary"
                    onClick={() => handleEdit(id)}>
              <Iconify icon={'eva:edit-2-fill'}
                       width={22} height={22} /></Button>
            <Button size="sm" color="success"
                    onClick={() =>showProductDetail(id,true)} >
              <Iconify icon={'fluent:apps-list-detail-24-filled'} width={22} height={22} />
            </Button>
       </ButtonGroup>
      </div>
      )} }
  ]
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
              <Table columns={colums} dataSource={products}  pagination={{total : totalPage,onChange: page =>{
                  fetchProducts(page)
                }}}/>
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
                          <Form.Select  id="fruit-select" name='brand' value={productKey.brand.id} onChange={handleInputChange}>
                            {brands.map((brand,key) =>(
                                <option
                                    key={key}
                                    value={brand.id}>
                                  {brand.name}
                                </option>
                              ) )}
                          </Form.Select>
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
                          <Form.Select id="fruit-select"
                                       name='category'
                                       value={productKey.category.id}
                                       onChange={handleInputChange}>
                            {categorys.map((option, index) => (
                                <option
                                    key={index}
                                    value={option.id}>
                                  {option.name}
                                </option>
                            ))}
                          </Form.Select>
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
                              value={"MEN"} id='flexRadioDefault1'
                              label='MEN'/>
                          <MDBRadio
                              onChange={handleInputChange}
                              name ='productGender'
                              defaultChecked={productKey.productGender === "UNISEX" }
                              value={"UNISEX"} id='flexRadioDefault1'
                              label='UNISEX'/>
                          <MDBRadio
                              onChange={handleInputChange}
                              name ='productGender'
                              defaultChecked={productKey.productGender === "WOMAN" }
                              value={"WOMAN"} id='flexRadioDefault1'
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
            </TableContainer>
          </Card>
        </Container>
      </Page>

  )
}
export default ProductManager;