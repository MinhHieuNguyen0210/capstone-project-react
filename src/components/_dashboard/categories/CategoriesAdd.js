import { Button, FormGroup, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import categoriesApi from '../../../api/categoriesApi';
import './styles.css';

const initialValue = {
  name: '',
  username: '',
  email: '',
  phone: ''
};

const useStyles = makeStyles({
  container: {
    width: '45%',
    height: '100%',
    margin: '10% 30% 0 30%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  }
});

const CategoriesAdd = (props) => {
  const { handleUpdateListCategories } = props;
  console.log(handleUpdateListCategories);
  const [user, setUser] = useState(initialValue);

  const classes = useStyles();

  const [status, setStatus] = useState('status');
  const [clickProducts, setClickProducts] = useState('');

  const [productList, setProductList] = useState([]);
  useEffect(() => {
    async function fetchProductList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/products';
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

  // handle form data
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);

  const [openFailed, setOpenFailed] = useState(false);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const onSubmit = (item) => {
    const { products } = item;
    const arr = [];
    arr.push(products);
    item.products = arr;
    item.image = selectedId;
    const data = JSON.stringify(item);
    console.log(data);
    categoriesApi
      .add(data)
      .then((response) => {
        console.log('add success !');
        setOpenSuccess(true);
        handleUpdateListCategories();
      })
      .catch((error) => {
        if (error.response) {
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

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedId, setSelectedId] = useState();
  async function uploadHandler() {
    const formData = new FormData();
    formData.append('file', selectedImage, selectedImage.name);
    console.log(formData);
    const response = await categoriesApi.uploadImage(formData);

    const { id } = response.data;
    setSelectedId(id);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h4">Add Categories</Typography>

          <FormControl>
            <TextField {...register('name')} id="standard-basic" label="Name" variant="standard" />
          </FormControl>
          {/* <FormControl>
        <TextField id="standard-basic" label="Category" variant="standard" />
      </FormControl> */}

          <FormControl>
            <TextField {...register('slug')} id="standard-basic" label="Slug" variant="standard" />
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
          {/* Upload iamge */}
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
              Submit
            </Button>
          </FormControl>
        </FormGroup>
      </form>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <MuiAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            Great, Successfully Added !
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
export default CategoriesAdd;
