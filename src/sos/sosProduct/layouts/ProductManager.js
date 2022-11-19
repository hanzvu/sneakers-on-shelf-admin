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
import {Spinner} from "react-bootstrap";
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
import { findProducDetailByProductid, findDetailBytid,deleteDetailById } from '../services/DetailService'
import { findBrandById,findBrands} from '../services/BrandService'
import { findCategories, findCategoryById} from '../services/CategoryService'
import { findProducImageByProductid,deleteById} from '../services/ImagesService'

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
    productDetails: [{
      id: '',
      quantity: '',
      size: ''
    }],
    sellPrice: '',
    originalPrice: '',
    importPrice: '',
    description: ''
  }
  const FILE_UPLOAD_CLOUD_ENDPOINT = "https://api.cloudinary.com/v1_1/dfcpqgj3f/image/upload";
  const [productKey, setProductKey] = useState(initialFormState);
  const [categorys, setCategorys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // call api brand
  const [brands, setBrands] = useState([]);
  const fetchBrand = async () => {
    const { data } = await findBrands()
    const brands = data;
    setBrands(brands);
    console.log(brands);
  };
  // call api category
  const fetchCategory = async () => {
    const { data } = await findCategories()
    const categorys = data;
    setCategorys(categorys);
  };

// and category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/admin/v1/products/updated", {
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
  const [loading, setLoading] = useState(true);
  const [totalPage,setTotal] = useState(1)
  const fetchProducts = async (page) => {
    console.log(page);
    if(page !== undefined ){
      const { data } = await paginationProduct(page)
      setProducts(data.content);
      setTotal(data.totalPages);
      setCurrentPage(page)
    }
  };
  const [idProduct, setIdProduct] = useState('');
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
    console.log(data)
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
  const [productDetails, setProductDetails] = useState([]);
  const showProductDetail = async (id) => {
    console.log("doubleclick: ")
    if(id !== undefined){
      setIdDelete(id)
      const  {data} =  await findProducDetailByProductid(id);
      const products = data;
      console.log("data: ")
      console.log(products)
      setProductDetails(products)
    }
  }
  const [idDelete, setIdDelete] = useState('');
  const [showEditDetail, setShowEditDetail] = useState(false);
  const [detailEdit, setDetailEdit] = useState('');
  const handleCloseEditDetail = () => setShowEditDetail(false);
  const handleEditDetail = async (id) => {
    console.log(id)
    setIdDelete(id)
    const  {data} =  await findDetailBytid(id);
    console.log(data)
    setDetailEdit(data)
    setShowEditDetail(true)
    console.log(detailEdit)
    showProductDetail(idDelete)
  };
  const handleInputDetailChange = (event) => {
    const { name, value } = event.target
    setDetailEdit({
      ...detailEdit,
      [name]: value
    })

    console.log(detailEdit)
  }
  const handleSubmitEditDetail = async (e) => {
    e.preventDefault();
    console.log("handleSubmitEditDetail")
    const res = await fetch("http://localhost:8080/admin/v1/productDetail/update", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'charset': 'UTF-8'
      },
      body: JSON.stringify(detailEdit),
    });
    showProductDetail(idDelete,true)
  };

  const handleDeleteDetail = async (id) => {
    setIdDelete(id)
    const  {data} =  await deleteDetailById(id);
    console.log(data)
    if(data.code === 200){
      toast(data.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }else{
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
    showProductDetail(idDelete)
  };
  const [showAddDetail, setShowAddDetail] = useState(false);
  const handleCloseAddDetail = () => setShowAddDetail(false);
  const addSize = {
    size: '',
    idProduct: '',
    quantity: ''
  }
  const [detailAddSize, setDetailAddSize] = useState(addSize);

  const handleSubmitAddDetail = async (e) => {
    e.preventDefault();
    console.log("detailAddSize",detailAddSize)
    console.log("handleSubmitEditDetail")
    fetch("http://localhost:8080/admin/v1/productDetail/create", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'charset': 'UTF-8'
      },
      body: JSON.stringify(detailAddSize),
    }).then(response => response.text())
        .then((response) => {
          const res = JSON.parse(response);
          if (res.code === 400) {
            toast(res.message, {
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
            toast("Tạo size thành công", {
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
        });
    showProductDetail(idDelete)
  };
  const handleInputAddDetailChange = (event) => {
    const { name, value } = event.target
    if(idDelete !== ''){
      setDetailAddSize({
        ...detailAddSize,
        [idProduct]: idDelete
      })
    }else{
      toast.error("Bạn chưa choọ sản phẩm để thêm size", {
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
    setDetailAddSize({
      ...detailAddSize,
      [name]: value
    })
    console.log(detailAddSize)
  }

  const handleShowAddSizeProduct = async(id) => {

    console.log("doubleclick: ")
    if(id !== undefined){
      setIdDelete(id)
      setShowAddDetail(true);
    }
  }
  /// product image
  const [showImage, setShowImage] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const handleShowImage = () =>setShowImage(true);
  const showProuctImages = async(id) => {
    showProductDetail(id)
    console.log("doubleclick: ")
    if(id !== undefined){
      setIdDelete(id)
      setDetailAddSize((prevState) => ({
        ...detailAddSize,
        idProduct: id
      }))
      const  {data} =  await findProducImageByProductid(id);
      console.log("data images: ")
      console.log(data)
      console.log('data[0].length')
      console.log(data[0].length)
      setProductImages(data)
      handleShowImage(true);
    }
  }
  const handleDeleteImages = async (id) => {
    if(id !== undefined){
      const  res =  await deleteById(id);
      console.log(res)
      if (res.code === 400) {
        toast(res.message, {
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
      showProuctImages(idDelete)
      console.log(detailEdit)
    }
  };
  const dataImage = {
    image:[],
    idproduct:''
  }
  const [showAddImages, setShowAddImages] = useState(false);
  const handleCloseAddImages = () => setShowAddImages(false);
  const [DataImage, setDataImage] = useState(dataImage);
  const handleShowAddImages = async (id) => {
   console.log("handleAddImages",id)
    setDataImage((prevState) => ({
      ...DataImage,
      idproduct: id,
    }))
    setShowAddImages(true)
  };

  const [isLoading, setLoadingAddImage] = useState(true)
  const [fileUploadProgress, setFileUploadProgress] = useState(false);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [fileSize, setFileSize] = useState(true);
  const handleSubmitImage = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    const formData = new FormData();
    formData.append('upload_preset', 'my-upload');
    const array = []
    console.log("fileInput.files.length",fileInput.files.length)
    setFileUploadProgress(true);
    setFileUploadResponse(null);
    setLoadingAddImage(false);
    setFileSize(true);
    for (let i = 0; i < fileInput.files.length; i+=1) {
      formData.append(`file`, fileInput.files[i])
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      fetch(FILE_UPLOAD_CLOUD_ENDPOINT, requestOptions)
          .then(response => response.text())
          .then((response) => {
            const data = JSON.parse(response);
            array.push(data.url)
            setFileUploadResponse(data.message);
          });
      setLoadingAddImage(false);
      setTimeout(handleSubmitImage, 3000);
    }
    setFileUploadResponse("Load thành công");
    setFileUploadProgress(false);
    setDataImage((prevState) => ({
      ...DataImage,
      image: array,
    }))
    setLoadingAddImage(true);
  };

  const handleSubmitAddImages = async (e) => {
    e.preventDefault();
    console.log("DataImage",DataImage)
      try {
        const res = await fetch("http://localhost:8080/admin/v1/images/add", {
          method: "POST",
          headers: {
            'Access-Control-Allow-Origin':'*',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
          },
          body: JSON.stringify(DataImage),
        });
        const resJson = await res.json();
        console.log("resJson",resJson)
        if (resJson.code === 400) {
          toast.error(resJson.message, {
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
          toast.info("Product created successfully", {
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
      } catch (err) {
        console.log(err);
      }
    showProuctImages(DataImage.idproduct)
    setDetailAddSize((prevState) => ({
      ...detailAddSize,
      image: []
    }))
  };

  /// pagination
  const columDetail = [
    {title: 'Size',dataIndex: 'size'},
    {title: 'Quantity',dataIndex: 'quantity'},
    {title: 'Acction',dataIndex:'id', render:(_,{id})=>(
          <div>
            <ButtonGroup>
              <Button size="sm" color="danger"><Iconify
                  icon={'ep:delete-filled'} width={22} height={22}
                  onClick={() => handleDeleteDetail(id)}  /></Button>
              <Button size="sm" color="primary" onClick={() => handleEditDetail(id)}>
                <Iconify icon={'eva:edit-2-fill'}
                         width={22} height={22} />
              </Button>
            </ButtonGroup>
          </div>
      ) }
  ]
  const columImages = [
    {title: 'image',dataIndex: 'image',render: ( _,{image})=>(
          <div>
            <img width={'50px'} src={image} alt={"erro"} />
          </div>
      )},
    {title: 'Acction',dataIndex:'id', render:(_,{id})=>(
          <div>
            <ButtonGroup>
              <Button size="sm" color="danger"><Iconify
                  icon={'ep:delete-filled'} width={22} height={22} onClick={() => handleDeleteImages(id)}/></Button>

            </ButtonGroup>
          </div>
      ) }
  ]
  const colums = [
    {title: 'name',dataIndex: 'name'},
    {title: 'Gender',dataIndex: 'productGender'},
    {title: 'Brand',dataIndex: 'brand',render: ( _,{brand})=>(
        <div>
          {brand.name}
        </div>
      )},
    {title: 'Category',dataIndex: 'category',render: ( _,{category})=>(
          <div>
            {category.name}
          </div>
      )},
    {title: 'SellPrice',dataIndex: 'sellPrice'},
    {title: 'Description',dataIndex: 'description'},
    {title: 'Acction',dataIndex:'id', render:(_,{id})=>(
        <div>
          <ButtonGroup>
            <Button size="sm" color="danger"
                    onChange={(e) => setIdProduct(id)}
                    onClick={() => deleteProduct(id)}><Iconify
                icon={'ep:delete-filled'} width={22} height={22} /></Button>

            <Button size="sm" color="primary"
                    onClick={() => handleEdit(id)}>
              <Iconify icon={'eva:edit-2-fill'}
                       width={22} height={22} /></Button>
            <Button size="sm" color="success"
                    onClick={() =>showProuctImages(id)}>
              <Iconify icon={'fluent:apps-list-detail-24-filled'} width={22} height={22} />
            </Button>
       </ButtonGroup>
      </div>
      ) }
  ]

  const pagination = [];
  for (let i = 1; i <= totalPage ; i+=1) {
    pagination.push(
        <Button size="sm" color={currentPage === i ? "secondary" : "primary"} onClick={() => fetchProducts(i)}>{i}</Button>
    )
  }
  useEffect(() => {
    fetchBrand();
    fetchCategory();
    fetchProducts(1);
    showProductDetail(idDelete);
    handleEditDetail(idDelete);

  }, []);
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
              <Table columns={colums} dataSource={products}  pagination={false}/>

                <Modal show={show} onHide={handleClose}
                       backdrop="static"
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
                      </MDBRow>
                      <MDBRow >
                        <MDBCol col='6'>
                          description
                          <MDBInput
                              name='description'
                              value={productKey.description}
                              onChange={handleInputChange}
                              wrapperClass='mb-4'  id='form1' type='text' />
                        </MDBCol>
                        <MDBCol col='6'>
                          Gender
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
                        </MDBCol>
                      </MDBRow>
                      <Button  variant="primary" type="submit">
                        update
                      </Button>
                    </Form>
                  </Modal.Body>
              </Modal>
            </TableContainer>
            <div className="mt-2 text-center">
            <ButtonGroup>
              <Button size="sm" color="primary" disabled={currentPage===1} onClick={() => fetchProducts(currentPage - 1)}><Iconify icon={'grommet-icons:form-previous'} width={22} height={22} /></Button>
              {pagination}
              <Button size="sm" color="primary" disabled={currentPage===totalPage} onClick={() => fetchProducts(currentPage + 1)}><Iconify icon={'grommet-icons:form-next'} width={22} height={22} /></Button>
            </ButtonGroup>
          </div>
          </Card>
          <Card style={{'padding-top':'50px'}} >
            <TableContainer sx={{ minWidth: 800 }}>
              <MDBRow>
                <MDBCol col='6'>
                  <Button size="sm" color="success"  onClick={() => handleShowAddSizeProduct(idDelete)}>
                    <Iconify icon={'material-symbols:add'} width={22} height={22} />
                  </Button>
                    <Table columns={columDetail} dataSource={productDetails} pagination={false}/>
                </MDBCol>
                  <MDBCol col='6'>
                    <Button size="sm" color="success" onClick={() => handleShowAddImages(idDelete)}>
                      <Iconify icon={'material-symbols:add'} width={22} height={22} />
                    </Button>
                    <Table columns={columImages} dataSource={productImages} pagination={false}/>
                  </MDBCol>
              </MDBRow>
            </TableContainer>
          </Card>
          <Modal
              show={showEditDetail}
              onHide={handleCloseEditDetail}
              backdrop="static"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Cập nhật số lượng của size {detailEdit.size}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MDBRow>
                <MDBCol col='6'>
                  <Form onSubmit={(e) =>handleSubmitEditDetail(e)}>
                    <MDBInput
                        wrapperClass='mb-4'
                        label=''
                        name='quantity'
                        value={detailEdit.quantity}
                        onChange={handleInputDetailChange}
                        id='form1'
                        type='text' />
                    <Button variant="secondary" type="submit">
                      Update
                    </Button>
                </Form>
                </MDBCol>
              </MDBRow>
            </Modal.Body>
          </Modal>

          <Modal
              show={showAddDetail}
              onHide={handleCloseAddDetail}
              backdrop="static"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Thêm size</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MDBRow>
                <MDBCol col='6'>
                  <Form onSubmit={(e) =>handleSubmitAddDetail(e)}>
                    <MDBInput
                        wrapperClass='mb-4'
                        label='size'
                        name='size'
                        value={detailAddSize.size}
                        onChange={handleInputAddDetailChange}
                        id='form1'
                        type='text' />
                    <MDBInput
                        wrapperClass='mb-4'
                        label='quantity'
                        name='quantity'
                        value={detailAddSize.quantity}
                        onChange={handleInputAddDetailChange}
                        id='form1'
                        type='text' />
                    <Button variant="secondary" type="submit">
                      add
                    </Button>
                  </Form>
                </MDBCol>
              </MDBRow>
            </Modal.Body>
          </Modal>

          <Modal show={showAddImages}
                 aria-labelledby="contained-modal-title-vcenter"
                 centered
                 onHide={handleCloseAddImages}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm ảnh sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form style={{'padding-bottom':'50px'}} onSubmit={(e) =>handleSubmitImage(e)}>
                <MDBInput
                    wrapperClass='mb-4'
                    label='Image'
                    id='form1'
                    name='file'
                    multiple
                    type='file' />
                <Button style={{'background-color' : 'black','color': 'wheat',}} variant="primary" type="submit" >
                  Load image
                </Button>
              </Form>
              <Button style={{'background-color' : 'black','color': 'wheat',}}
                      variant="primary" type="submit"
                      onClick={(e) =>handleSubmitAddImages(e)}
              >
                Thêm ảnh
              </Button>
              {!fileSize && <p style={{color:'red'}}>File size exceeded!!</p>}
              {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
              {fileUploadResponse!= null && <Spinner animation={'border'} />}
            </Modal.Body>
          </Modal>
        </Container>
        <ToastContainer />
      </Page>

  )
}
export default ProductManager;