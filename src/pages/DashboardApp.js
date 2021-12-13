// material
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Container, Typography } from '@material-ui/core';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppRevenueChart,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
  AppCurrentVisits
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp(props) {
  const location = useLocation();
  console.log(location);

  const obj = {
    vertical: 'top',
    horizontal: 'right'
  };
  const [notifications, setNotifications] = useState(false);
  const handleCloseNoti = () => {
    setNotifications(false);
  };
  useEffect(() => {
    if (location.state !== null) {
      setNotifications(true);
    }
  }, []);

  return (
    <Page title="Dashboard | Admin">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome to Foody Admin </Typography>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/dashboard">
                Home
              </Link>
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs>
          </div>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid> */}

          <Grid item xs={12} md={6} lg={12}>
            <AppRevenueChart />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>
          {/*
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
      <Snackbar anchorOrigin={obj} open={notifications} onClose={handleCloseNoti}>
        <MuiAlert onClose={handleCloseNoti} severity="success" sx={{ width: '100%' }} filledError>
          <AlertTitle>Login Success</AlertTitle>
          <b> Welcome to Foody Admin </b>
        </MuiAlert>
      </Snackbar>
    </Page>
  );
}
