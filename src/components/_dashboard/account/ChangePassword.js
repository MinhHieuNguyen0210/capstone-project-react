import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Input,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import Cookies from 'js-cookie';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@material-ui/styles';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useForm } from 'react-hook-form';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import UserApi from '../../../api/userApi';

const useStyles = makeStyles({
  container: {
    width: '40%',
    height: '32%',
    margin: '10% 30% 0 30%',
    '& > *': {
      marginTop: 20
    },
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px'
  }
});

const ChangePassword = (props) => {
  const { idUser } = props;
  const token = Cookies.get('tokenUser');
  console.log(idUser);
  const classes = useStyles();

  const [openSuccess, setOpenSuccess] = useState(false);

  const [openFailed, setOpenFailed] = useState(false);

  const [checkMatchPassword, setCheckMatchPassword] = useState(false);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseFailed = () => {
    setOpenFailed(false);
  };
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const handleShowRepeatPassword = () => {
    setShowRepeatPassword((show) => !show);
  };

  const { register, handleSubmit } = useForm();

  const onSubmit = (item) => {
    const { newPassword, repeatPassword } = item;
    console.log(`${newPassword}  ${repeatPassword}`);
    const data = {
      password: newPassword
    };
    if (newPassword === repeatPassword) {
      UserApi.editUser(idUser, data, token)
        .then((response) => {
          console.log('success');
          setOpenSuccess(true);
        })
        .catch((error) => {
          if (error) {
            console.log('failed');
            setOpenFailed(true);
          }
        });
    } else {
      console.log('dont match');
      setCheckMatchPassword(true);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className={classes.container}>
          <Typography variant="h5">Change password</Typography>

          <TextField
            {...register('newPassword')}
            id="filled-number"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowNewPassword} edge="end">
                    <Icon icon={showNewPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            {...register('repeatPassword')}
            id="filled-number"
            label="Repeat Password"
            type={showRepeatPassword ? 'text' : 'password'}
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowRepeatPassword} edge="end">
                    <Icon icon={showRepeatPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: '100%', margin: '10px auto' }}
            >
              Change password
            </Button>
          </FormControl>
        </FormGroup>
      </form>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <MuiAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            Great, Successfully !
          </MuiAlert>
        </Snackbar>

        <Snackbar open={openFailed} autoHideDuration={6000} onClose={handleCloseFailed}>
          <MuiAlert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
            Something went wrong !
          </MuiAlert>
        </Snackbar>

        <Snackbar open={checkMatchPassword} autoHideDuration={6000} onClose={handleCloseFailed}>
          <MuiAlert onClose={handleCloseFailed} severity="error" sx={{ width: '100%' }}>
            The repeat password must match with new password !
          </MuiAlert>
        </Snackbar>
      </Stack>
    </>
  );
};

export default ChangePassword;
