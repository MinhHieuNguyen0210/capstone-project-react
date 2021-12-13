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
import productApi from '../../../api/productApi';

const initialValue = {
  name: '',
  username: '',
  email: '',
  phone: ''
};

const useStyles = makeStyles({
  container: {
    width: '45%',
    margin: '2% 30% 0 30%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  }
});

const UserEdit = (props) => {
  const { data } = props;
  const { handleUpdateListProduct, idCate } = props;

  const classes = useStyles();
  // handle form data
  const { setValue, register, handleSubmit } = useForm();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [clickCategory, setClickCategory] = useState(idCate);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedId, setSelectedId] = useState();

  const onSubmit = (item) => {
    const { categories } = item;
    console.log(categories);
    const arr = [];
    arr.push(categories);
    item.categories = arr;
    item.image = selectedId;
    const formData = JSON.stringify(item);
    console.log(formData);
    productApi
      .update(formData, data)
      .then((response) => {
        console.log('update success !');
        setOpenSuccess(true);
        handleUpdateListProduct();
      })
      .catch((error) => {
        if (error.response) {
          console.log('update failed!');
          setOpenFailed(true);
        }
      });
  };
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };
  useEffect(() => {
    async function getDataProductEdit() {
      const response = await productApi.getById(data);

      const data1 = response.data[0];
      console.log(data1);
      setValue('productID', data1.productID);
      setValue('status', data1.status);
      setValue('description', data1.description);
      setValue('name', data1.name);
      setValue('price', data1.price);

      // const dateImage = response.data[0]
    }
    getDataProductEdit();
  }, []);
  // cattegories

  useEffect(() => {
    async function fetchCategoriestList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/categories?isDeleted=false';
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      // console.log({ responseJSON });

      const data = responseJSON;
      setCategoriesList(data);
    }
    fetchCategoriestList();
  }, []);

  const handleChange = (event) => {
    setClickCategory(event.target.value);
    // console.log(event.target.value);
  };

  async function uploadHandler() {
    const formData = new FormData();
    formData.append('file', selectedImage, selectedImage.name);
    const response = await productApi.uploadImage(formData);

    const { id } = response.data;
    setSelectedId(id);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h4">Edit Food </Typography>
          <FormControl>
            <TextField
              {...register('productID')}
              id="standard-basic"
              label="ProductID"
              variant="standard"
              defaultValue="loading.."
            />
          </FormControl>
          <FormControl>
            <TextField
              {...register('name')}
              id="standard-basic"
              label="Name"
              variant="standard"
              defaultValue="loading.."
            />
          </FormControl>
          <FormControl>
            <TextField
              {...register('status')}
              id="standard-basic"
              label="Status"
              variant="standard"
              defaultValue="loading.."
            />
          </FormControl>
          <FormControl>
            <TextField
              {...register('description')}
              id="standard-basic"
              label="Description"
              variant="standard"
              defaultValue="loading.."
            />
          </FormControl>
          <FormControl>
            <TextField
              {...register('price')}
              id="standard-basic"
              label="Price"
              variant="standard"
              defaultValue="loading.."
            />
          </FormControl>
          {/* Categories */}
          <FormControl fullWidth>
            <InputLabel htmlFor="uncontrolled-native">Categories</InputLabel>
            <Select
              {...register('categories')}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={clickCategory}
              label="Categories"
              onChange={handleChange}
            >
              {categoriesList.map((item) => {
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
            Great, Update Success !
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
