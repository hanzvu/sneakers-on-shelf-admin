import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Spinner} from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
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

import Modal from 'react-bootstrap/Modal';
import { getTemplateSaveListProduct } from '../services/ProductService'

function FromCreate() {
  const FILE_UPLOAD_CLOUD_ENDPOINT = "https://api.cloudinary.com/v1_1/dfcpqgj3f/image/upload";
  const navigate = useNavigate();


// call api brand
const [ imgpPoducts, setImgpPoducts ] = useState([])
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
const initialFormState = { 
  id: '', 
  name: '', 
  productGender: 'MEN',
  brand: 'Giày bóng rổ',
  category: 'Giay chạy',
  productImage: imgpPoducts,
  sellPrice: '',
  description: '',
    size35:'',
    size36:'',
    size37:'',
    size38:'',
    size39:'',
    size40:'',
    size41:'',
    size42:'',
    size43:''
}

	const [ productN, setProductN ] = useState(initialFormState)
	const handleInputChange = event => {
        const { name, value } = event.target
        setProductN({ ...productN,
        [name]: value
        })
	}
    const handleSubmitImage = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
        const formData = new FormData();
        formData.append('upload_preset', 'my-upload');
        const array = []
        console.log("fileInput.files.length",fileInput.files.length)
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
                });
        }
        setProductN({ ...productN,
            productImage: array
        })
    };
    console.log("productN",productN)
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
      console.log("resJson",resJson)
      if (resJson.status === 400) {
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
      }else if(resJson.code === 400){
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
    const [isLoading, setLoading] = useState(true)
    const [fileSize, setFileSize] = useState(true);
    
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
  
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080/admin/v1/products/saveList";
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
        setLoading(false);
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
                   setLoading(true);
                   return Promise.reject(error);
               }
               setLoading(true);
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
          <Button variant="primary" style={{'background-color' : 'black','color': 'wheat',}} onClick={handleShow}>
              Import List Product
          </Button>
          <Button style={{'background-color' : 'black','color': 'wheat',}}  variant="primary" onClick={() => downloadTemplate()}>
              Dowload Template
          </Button>
        </Stack>
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
            <Form.Select id="fruit-select"  name='brand' value={productN.brand} onChange={handleInputChange} >
            {brands.map((option, index) => (
              <option
              key={index}>
                {option.name}
              </option>
            ))}
            </Form.Select>
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
            <Form.Select id="fruit-select"  name='category' value={productN.category} onChange={handleInputChange}>
            {categorys.map((option, index) => (
              <option
              key={index}
              >
                {option.name}
              </option>
            ))}
          </Form.Select>
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
          <MDBCol col='6'>
            <div col='6' >
              <MDBRadio onChange={handleInputChange}
                                checked={productN.productGender}
                                name ='productGender'
                                value='MEN' id='flexRadioDefault1'
                                label='MEN' />
              <MDBRadio onChange={handleInputChange}
                                name ='productGender'
                                value='UNISEX' id='flexRadioDefault1'
                                label='UNISEX' />
              <MDBRadio onChange={handleInputChange}
                                name ='productGender'
                                value='WOMAN' id='flexRadioDefault1'
                                label='WOMAN'/>
            </div>
         </MDBCol>
      </MDBRow>
      <MDBRow>
          <MDBCol col='3'>
              <MDBInput
                  value={productN.size35}
                  name='size35'
                  onChange={handleInputChange}
                  wrapperClass='mb-4' label='size 35' id='form1' type='text' />
          </MDBCol>
          <MDBCol col='3'>
              <MDBInput
                  value={productN.size36}
                  name='size36'
                  onChange={handleInputChange}
                  wrapperClass='mb-4' label='size 36' id='form1' type='text' />
          </MDBCol>
          <MDBCol col='3'>
              <MDBInput
                  value={productN.size37}
                  name='size37'
                  onChange={handleInputChange}
                  wrapperClass='mb-4' label='size 37' id='form1' type='text' />
          </MDBCol>
          <MDBCol col='3'>
              <MDBInput
                  value={productN.size38}
                  name='size38'
                  onChange={handleInputChange}
                  wrapperClass='mb-4' label='size 38' id='form1' type='text' />
          </MDBCol>
          <MDBCol col='3'>
              <MDBInput
                  value={productN.size39}
                  name='size39'
                  onChange={handleInputChange}
                  wrapperClass='mb-4' label='size 39' id='form1' type='text' />
          </MDBCol>
      </MDBRow>
        <MDBRow>
            <MDBCol col='3'>
                <MDBInput
                    value={productN.size40}
                    name='size40'
                    onChange={handleInputChange}
                    wrapperClass='mb-4' label='size 40' id='form1' type='text' />
            </MDBCol>
            <MDBCol col='3'>
                <MDBInput
                    value={productN.size41}
                    name='size41'
                    onChange={handleInputChange}
                    wrapperClass='mb-4' label='size 41' id='form1' type='text' />
            </MDBCol>
            <MDBCol col='3'>
                <MDBInput
                    value={productN.size42}
                    name='size42'
                    onChange={handleInputChange}
                    wrapperClass='mb-4' label='size 42' id='form1' type='text' />
            </MDBCol>
            <MDBCol col='3'>
                <MDBInput
                    value={productN.size43}
                    name='size43'
                    onChange={handleInputChange}
                    wrapperClass='mb-4' label='size 43' id='form1' type='text' />
            </MDBCol>
        </MDBRow>
        <MDBRow>
            <MDBCol col='3'>
                <Button style={{'background-color' : 'silver','color': 'blue','width': '150px','height': '55px'}} variant="primary" type="submit" >
                    Submit
                </Button>
                <ToastContainer />
            </MDBCol>
        </MDBRow>
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
            {isLoading ? "" : <Spinner animation={'border'} />}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FromCreate;
