import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Cookies from 'js-cookie';
import AlertTitle from '@mui/material/AlertTitle';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import userApi from '../../../api/userApi';

// ----------------------------------------------------------------------

export default function LoginForm(props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const handleClickNoti = () => {
    setNotifications(true);
  };

  const handleCloseNoti = () => {
    setNotifications(false);
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  const obj = {
    vertical: 'top',
    horizontal: 'right'
  };
  const obj1 = {
    Transition: Slide
  };
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log(values);
      const fetchUserLogin = async () => {
        try {
          const response = await userApi.postUser(values);
          console.log('Login succesfully: ', response);
          // fakeAuth.authenticate(() => {
          //   setDirectstate(() => ({
          //     redirectToReferrer: true
          //   }));
          // });

          Cookies.set('tokenUser', response.data.data.token);
          const adminData = response.data.data.user;
          Cookies.set('adminData', JSON.stringify(adminData));
          setTimeout(() => {
            Cookies.remove('tokenUser');
          }, 6000000);
          // console.log("token: ", response.token);
          navigate('/dashboard/app', { state: { isLogin: true }, replace: true });
        } catch (error) {
          console.log('failed to fetch login: ', error);
          // notification.open({
          //   message: 'Login Fail',
          //   description: 'Your email or password is incorrect',
          //   icon: <InfoCircleFilled style={{ color: 'red' }} />
          // });

          handleClickNoti();
        }
      };
      fetchUserLogin();
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              name="email"
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              name="password"
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            />

            {/* <Link component={RouterLink} variant="subtitle2" to="#">
              Forgot password?
            </Link> */}
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            // loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
      <Snackbar anchorOrigin={obj} open={notifications} onClose={handleCloseNoti}>
        <MuiAlert onClose={handleCloseNoti} severity="error" sx={{ width: '100%' }} filledError>
          <AlertTitle>Login Fail</AlertTitle>
          <p> Your email or password is incorrect </p>
        </MuiAlert>
      </Snackbar>
    </>
  );
}
