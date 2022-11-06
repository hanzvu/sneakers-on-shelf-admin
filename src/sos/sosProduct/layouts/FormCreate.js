import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components

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

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FileUpload } from '@mui/icons-material';
import { getTemplateSaveListProduct } from '../services/ProductService'

function FromCreate() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


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

const handleChangeCategory = event => {
  console.log(event.target.value)
  setProductN({ ...productN, 
    category: event.target.value 
  })
};
const handleChangeBrand = event => {
  console.log(event.target.value)
  setProductN({ ...productN, 
    brand: event.target.value 
  })
};

// save product
const brandKey = {
  id: "1", 
  name: "Nike"
};

const categoryKey = {
  id: "1", 
  name: "Giày Bóng Rổ"
};

const initialFormState = { 
  id: '', 
  name: '', 
  productGender: "MEN",
  brand: brandKey,
  category: categoryKey,
  sellPrice: '',
  originalPrice: '',
  importPrice: '',
  description: ''
}
	const [ productN, setProductN ] = useState(initialFormState)

	const handleInputChange = event => {
	const { name, value } = event.target
  setProductN({ ...productN, 
    [name]: value 
  })
	}

// end save product
  const handleSubmit = async (e,productN) => {
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
        body: JSON.stringify(productN),
      });
      const resJson = await res.json();
      if (resJson.code === 400 || resJson.status === '400') {
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
  };
  
  
// Import
const [files, setFiles] = useState('');
   
    const [fileSize, setFileSize] = useState(true);
    
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
  
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080/content/v1/products/saveList";

    const uploadFileHandler = (event) => {
      setFiles(event.target.files);
     };

     const submitForm = (event) => {
      event.preventDefault();
      setFileSize(true);
      setFileUploadProgress(true);
      setFileUploadResponse(null);

       const formData = new FormData();
       for (let i = 0; i < files.length; i+=1) {
           formData.append(`files`, files[i])
       }

       const requestOptions = {
           method: 'POST',
           body: formData
       };
       fetch(FILE_UPLOAD_BASE_ENDPOINT, requestOptions)
           .then(async response => {
               const isJson = response.headers.get('content-type')?.includes('application/json');
               const data = isJson && await response.json();

               // check for error response
               if (!response.ok) {
                console.log("send file false ")
                   // get error message
                   const error = (data && data.message) || response.status;
                   setFileUploadResponse(data.message);
                   return Promise.reject(error);
               }
               console.log("send file Ok ")
              console.log(data.message);
              alert("send file Ok ")
              setFileUploadResponse(data.message);
           })
           .catch(error => {
               console.error('Error while uploading file!', error);
           });
       setFileUploadProgress(false);
     };
// modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // dowload template excel insert product
const downloadTemplate = () => {
  getTemplateSaveListProduct()
}


  return (
    <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create Product
          </Typography>
          <Button variant="primary" onClick={handleShow}>
              Import List Product 
              
          </Button>
          <Button variant="primary" onClick={() => downloadTemplate()}>
              Dowload Template
          </Button>
        </Stack>
    <Form onSubmit={(e) =>handleSubmit(e,productN)}>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Name'
            name='name'
            value={productN.name}
            onChange={handleInputChange}
            id='form1'
            type='text' />
        </MDBCol>
        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Original Price'
            value={productN.originalPrice}
            name='originalPrice'
            onChange={handleInputChange}
            id='form1' 
            type='number' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          Brand
          <select id="fruit-select">
            {brands.map((option, index) => (
              <option
              onChange={handleInputChange} 
              name='brand' 
              key={index} 
              defaultValue={productN.brand}
              value={productN.brand}> 
                {option.name}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4'
            label='Sell Price'
            value={productN.sellPrice}
            name='sellPrice'
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
              name='category' 
              key={index}
              defaultValue={productN.category}
              value={productN.category} onChange={handleInputChange}> 
                {option.name}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol col='6'>
          <MDBInput
            wrapperClass='mb-4'
            label='Import Price'
            value={productN.importPrice}
            name='importPrice'
            onChange={handleInputChange}
            id='form1'
            type='number' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput
            value={productN.description}
            name='description'
            onChange={handleInputChange}
            wrapperClass='mb-4' label='Description' id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <div>
          <MDBRadio onChange={handleInputChange}  
                            name ='productGender'  
                            checked 
                            defaultValue={productN.productGender}
                            value={productN.productGender} id='flexRadioDefault1' 
                            label='MEN' />
          <MDBRadio onChange={handleInputChange}  
                            name ='productGender'    
                            value={productN.productGender} id='flexRadioDefault1' 
                            label='UNISEX' />
          <MDBRadio onChange={handleInputChange}  
                            name ='productGender'   
                            value={productN.productGender} id='flexRadioDefault1' 
                            label='WOMAN'/>
        </div>
      </MDBRow>
      <Button variant="primary" type="submit" >
        Submit
      </Button>
      <ToastContainer />
    </Form>
    
    <Modal show={show} onHide={handleClose}
    aria-labelledby="contained-modal-title-vcenter"
    centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm bằng Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={submitForm}>
        <br />
        <input type="file" multiple  onChange={uploadFileHandler} />
        <br />
        <button type='submit'>Thêm</button>
        {!fileSize && <p style={{color:'red'}}>File size exceeded!!</p>}
         {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
        {fileUploadResponse!=null && <p style={{color:'green'}}>{fileUploadResponse}</p>}

      </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FromCreate;
