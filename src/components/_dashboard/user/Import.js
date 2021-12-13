import react, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormGroup, FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
    width: '50%',
    margin: '5% 25% 0 25%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  }
});

const Import = (props) => {
  const { idImport, handleUpdateListProduct } = props;
  const { handleCloseImport } = props;

  console.log(idImport);
  const [user, setUser] = useState(initialValue);
  const classes = useStyles();

  const onValueChange = (e) => {
    console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // getCurrent quantity
  const dataProductImport = useRef(0);
  useEffect(() => {
    async function getDataProductImport() {
      await productApi.getById(idImport).then((respone) => {
        const data = respone.data[0];
        const { quantity } = data;
        dataProductImport.current = quantity;
        localStorage.setItem('quantity', dataProductImport.current);
      });
    }
    getDataProductImport();
  }, []);

  const { register, handleSubmit } = useForm();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const onSubmit = async (item) => {
    const { quantity } = item;

    console.log(item);
    console.log(quantity);
    if (quantity !== '') {
      const newQuantity = parseInt(localStorage.getItem('quantity'), 10) + parseInt(quantity, 10);
      item.quantity = newQuantity;

      const formData = JSON.stringify(item);
      console.log(formData);
      await productApi
        .update(formData, idImport)
        .then(() => {
          console.log('success');
          setOpenSuccess(true);
          // handleCloseImport();
          handleUpdateListProduct();
        })
        .catch((error) => {
          if (error.response) {
            console.log('erorr');
            setOpenFailed(true);
          }
        });
    } else {
      setOpenFailed(true);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h4">Import product</Typography>
          <TextField
            {...register('quantity')}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            label="Quantity"
            type="number"
          />

          <FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: '100%', margin: '10px auto' }}
            >
              Import
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
export default Import;
