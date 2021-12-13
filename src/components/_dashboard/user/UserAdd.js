import { Button, FormGroup, TextField, Typography, Grid } from '@material-ui/core';
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
import productApi from '../../../api/productApi';
import './styles.css';

const initialValue = {
  name: '',
  username: '',
  email: '',
  phone: ''
};

const useStyles = makeStyles({
  container: {
    width: '40%',
    height: '100%',
    margin: '2% 30% 0 30%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  },
  textField: {
    width: '400px',
    margin: '10px 0'
  }
});

const UserAdd = (props) => {
  const { handleUpdateListProduct } = props;
  const [user, setUser] = useState(initialValue);

  const classes = useStyles();

  const onValueChange = (e) => {
    console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const [status, setStatus] = useState('status');
  // Notifications

  const [openSuccess, setOpenSuccess] = useState(false);

  const [openFailed, setOpenFailed] = useState(false);
  const [clickCategory, setClickCategory] = useState('');
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    async function fetchCategoriestList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/categories?isDeleted=false';
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({ responseJSON });

      const data = responseJSON;
      setCategoriesList(data);
    }
    fetchCategoriestList();
  }, []);

  const handleChange = (event) => {
    setClickCategory(event.target.value);
    console.log(event.target.value);
  };

  // handle submit image
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedId, setSelectedId] = useState();
  async function uploadHandler() {
    const formData = new FormData();
    formData.append('file', selectedImage, selectedImage.name);
    console.log(formData);
    const response = await productApi.uploadImage(formData);

    const { id } = response.data;
    setSelectedId(id);
  }

  // handle form data
  const { register, handleSubmit } = useForm();

  const onSubmit = (item) => {
    const { categories } = item;
    const arr = [];
    arr.push(categories);
    item.categories = arr;
    item.image = selectedId;

    const data = JSON.stringify(item);
    console.log(data);
    productApi
      .add(data)
      .then((response) => {
        console.log('add success !');
        setOpenSuccess(true);
        handleUpdateListProduct();
      })
      .catch((error) => {
        if (error.response) {
          console.log('add failed!');
          setOpenSuccess(false);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h4">Create A New Food</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl>
                <TextField
                  {...register('productID')}
                  id="standard-basic"
                  label="Product ID"
                  size="medium"
                  variant="outlined"
                  className={classes.textField}
                />
              </FormControl>
              <FormControl>
                <TextField
                  {...register('name')}
                  id="standard-basic"
                  label="Name"
                  variant="outlined"
                  className={classes.textField}
                />
              </FormControl>
              <FormControl>
                <TextField
                  {...register('status')}
                  id="standard-basic"
                  label="Status"
                  variant="outlined"
                  value="published"
                  className={classes.textField}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <TextField
                  {...register('description')}
                  id="standard-basic"
                  label="Description"
                  variant="outlined"
                  className={classes.textField}
                />
              </FormControl>
              <FormControl>
                <TextField
                  {...register('price')}
                  id="standard-basic"
                  label="Price"
                  variant="outlined"
                  className={classes.textField}
                />
              </FormControl>
              {/* Categories */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" style={{ marginTop: '10px' }}>
                  Categories
                </InputLabel>
                <Select
                  {...register('categories')}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={clickCategory}
                  label="Categories"
                  onChange={handleChange}
                  style={{ width: '400px', marginTop: '10px' }}
                >
                  {categoriesList.map((item, index) => {
                    const { _id, name } = item;

                    return (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

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
              Add food
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
export default UserAdd;
