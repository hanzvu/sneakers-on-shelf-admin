import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
  MDBIcon
}
  from 'mdb-react-ui-kit';
import Form from 'react-bootstrap/Form';

// ----------------------------------------------------------------------

export default function FromUpdate() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <Form>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Name' id='form1' type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Brand' id='form1' type='' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Category' id='form1' type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Image' id='form1' type='file' />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Sell Price' id='form1' type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Original Price' id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' />
        </MDBCol>

        <MDBCol col='6'>
          <MDBInput wrapperClass='mb-4' label='Import Price' id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol col='9'>
          <MDBInput wrapperClass='mb-4' label='Description' id='form1' type='text' />
        </MDBCol>
      </MDBRow>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Label>Gender</Form.Label>
        <Form.Check type="checkbox" label="Male" />
        <Form.Check type="checkbox" label="Female" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
