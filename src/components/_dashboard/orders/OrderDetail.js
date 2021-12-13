import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, styled } from '@material-ui/styles';
import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  Grid
} from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';
import orderApi from '../../../api/orderApi';

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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const OrderDetail = (props) => {
  const { idOrder } = props;

  const classes = useStyles();
  const token = Cookies.get('tokenUser');
  // get order by idOrder
  const [orderDetail, setOrderDetail] = useState({});
  const [productDetail, setProductDetail] = useState([]);
  useEffect(() => {
    async function getOrder() {
      const res = await orderApi.getOrderById(idOrder.current, token);
      setProductDetail(res.data.products);
      setOrderDetail(res.data);
    }
    getOrder();
  }, []);

  return (
    <div>
      <FormGroup className={classes.container}>
        <Typography variant="h4">Order Details </Typography>
        <Divider />
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid item xs={6}>
            <Typography>Customer ID: {orderDetail.userID} </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Address: {orderDetail.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Total Price: {orderDetail.totalAmount}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Phone Number: {orderDetail.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Email: {orderDetail.email}</Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product ID</StyledTableCell>
                <StyledTableCell align="right">Name</StyledTableCell>
                <StyledTableCell align="right">Price (VNĐ)</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                {/* <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {productDetail.map((row) => {
                const { _id, quantity, productID, name, price } = row;
                return (
                  <StyledTableRow key={_id}>
                    <StyledTableCell align="left">{productID}</StyledTableCell>
                    <StyledTableCell align="right">{name}</StyledTableCell>
                    <StyledTableCell align="right">{price}</StyledTableCell>
                    <StyledTableCell align="right">{quantity}</StyledTableCell>
                    {/* <StyledTableCell align="right">{quantity}</StyledTableCell> */}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </FormGroup>
    </div>
  );
};

export default OrderDetail;
