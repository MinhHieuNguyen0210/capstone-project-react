import react, { useState, useEffect, useRef, forwardRef } from 'react';
import { FormGroup, Input, Button, Typography, TextField } from '@material-ui/core';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import './styles.css';
import categoriesApi from '../../../api/categoriesApi';

const initialValue = {
  name: '',
  username: '',
  email: '',
  phone: ''
};

const useStyles = makeStyles({
  container: {
    width: '45%',
    margin: '10% 30% 0 30%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  }
});

const UserEdit = (props) => {
  const { data, idProduct } = props;
  const { handleUpdateListCategories } = props;
  const classes = useStyles();

  // handle form data
  const { setValue, register, handleSubmit } = useForm();
  const [open, setOpen] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedId, setSelectedId] = useState();

  const onSubmit = (item) => {
    const { products } = item;
    const arr = [];
    arr.push(products);
    item.products = arr;
    item.image = selectedId;

    const formData = JSON.stringify(item);
    console.log(formData);
    categoriesApi
      .update(formData, data)
      .then((response) => {
        console.log('update success !');
        setOpen('success');
        setOpenSuccess(true);
        handleUpdateListCategories();
        console.log(open);
      })
      .catch((error) => {
        if (error.response) {
          console.log('update failed!');
          setOpen('error');
          setOpenFailed(true);
        }
      });
    if (open === 'success') {
      setOpenSuccess(true);
    }
    if (open === 'error') {
      setOpenFailed(true);
    }
  };
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  // cattegories
  const [clickProducts, setClickProducts] = useState(idProduct);

  const [productList, setProductList] = useState([]);
  useEffect(() => {
    async function fetchProductList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/products?isDeleted=false';
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({ responseJSON });

      const data = responseJSON;
      setProductList(data);
    }
    fetchProductList();
  }, []);

  const handleChange = (event) => {
    setClickProducts(event.target.value);
    console.log(event.target.value);
  };

  // get product edit

  useEffect(() => {
    async function getDataCategoriesEdit() {
      const response = await categoriesApi.getById(data);

      const data1 = response.data[0];

      console.log(data1);
      setValue('name', data1.name);
      setValue('slug', data1.slug);
    }
    getDataCategoriesEdit();
  }, []);

  // handle Image Upload
  async function uploadHandler() {
    const formData = new FormData();
    formData.append('file', selectedImage, selectedImage.name);
    const response = await categoriesApi.uploadImage(formData);

    const { id } = response.data;
    setSelectedId(id);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h4">Edit Categories</Typography>

          <FormControl>
            <TextField
              {...register('name')}
              id="standard-basic"
              label="Name"
              variant="standard"
              defaultValue="loading..."
            />
          </FormControl>
          {/* <FormControl>
        <TextField id="standard-basic" label="Category" variant="standard" />
      </FormControl> */}

          <FormControl>
            <TextField
              {...register('slug')}
              id="standard-basic"
              label="Slug"
              variant="standard"
              defaultValue="loading..."
            />
          </FormControl>
          {/* Categories */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Products</InputLabel>
            <Select
              {...register('products')}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={clickProducts}
              label="Products"
              onChange={handleChange}
            >
              {productList.map((item) => {
                const { _id, name } = item;

                return <MenuItem value={_id}>{name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl>
            <input
              type="file"
              name="myImage"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
            />
            <Button onClick={uploadHandler}>Upload</Button>

            {selectedImage && (
              <div>
                <Typography>Preview</Typography>
                <img
                  alt="not fount"
                  width="250px"
                  height="150px"
                  src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <Button onClick={() => setSelectedImage(null)}>Remove</Button>
              </div>
            )}
          </FormControl>
          {/* Upload iamge */}

          {/* <DatePickerComponent
        style={{ fontSize: '15px', marginTop: '14px ' }}
        id="datepicker"
        placeholder="Enter date"
        borderColor="#00A555"
      /> */}

          <FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: '100%', margin: '10px auto' }}
            >
              Edit
            </Button>
          </FormControl>
        </FormGroup>
      </form>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <MuiAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            Great, Updated Successfully !
          </MuiAlert>
        </Snackbar>

        <Snackbar open={openFailed} autoHideDuration={6000} onClose={handleCloseFailed}>
          <MuiAlert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
            Something went wrong !
          </MuiAlert>
        </Snackbar>
      </Stack>
    </>
  );
};
export default UserEdit;
