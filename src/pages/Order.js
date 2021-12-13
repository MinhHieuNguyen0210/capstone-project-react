// material
import {
  Box,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DoneIcon from '@mui/icons-material/Done';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MuiAlert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal'; // components
import Snackbar from '@mui/material/Snackbar';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Cookies from 'js-cookie';
import { filter } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import orderApi from '../api/orderApi';
import Label from '../components/Label';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import OrderDetail from '../components/_dashboard/orders/OrderDetail';
import { UserListHead } from '../components/_dashboard/user';

const TABLE_HEAD = [
  // { id: 'orderId', label: 'Order ID', alignRight: false },
  { id: 'userId', label: 'Customer Name', alignRight: false },
  // { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isPaid', label: 'IsPaid', alignRight: false },
  { id: 'paymentType', label: 'Payment Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'created', label: 'Created At', alignRight: false },
  { id: 'updated', label: 'Done At', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderList, setOrderList] = useState([]);
  const token = Cookies.get('tokenUser');
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [isvisible, SetVisible] = useState(false);
  const [orderAction, setOrderAction] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    async function getAllOrder() {
      const respone = await orderApi.getAllOrder(token);
      console.log(respone.data.results);
      setOrderList(respone.data.results);
    }
    getAllOrder();
  }, [orderAction]);

  // getOrderIsPending
  const [orderListPending, setOrderListPending] = useState([]);
  useEffect(() => {
    async function getOrderPending() {
      const respone = await orderApi.getOrderPending(token);
      console.log(respone.data);
      setOrderListPending(respone.data);
    }
    getOrderPending();
  }, [orderAction]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = USERLIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const allOrderList = orderList;
  const ordersPending = orderListPending;
  const isUserNotFound = allOrderList.length === 0;

  const formatIsoStringToDate = (data) => {
    const date = new Date(data);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString(
      ('en', { timeStyle: 'short', hour12: false, timeZone: 'UTC' })
    );
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = `0${dt}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    const object = { year, month, dt, time };
    return object;
  };
  const toggle = () => {
    SetVisible(!isvisible);
  };
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => setOpenOrderDetail(false);
  const idOrder = useRef(0);
  const handleOpenOrderDetail = (id) => {
    setOpenOrderDetail(true);

    idOrder.current = id;
  };
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const handleClickConfirm = async (id) => {
    console.log(id);
    const body = {
      status: 'ACCEPTED'
    };
    await orderApi
      .update(token, id, body)
      .then(() => {
        console.log('ACCEPTED');
        setOpenSuccess(true);
        setOrderAction(!orderAction);
        console.log(orderAction);
      })
      .catch((error) => {
        if (error.response) {
          console.log('Update failed');
          setOpenFailed(true);
        }
      });
  };

  const handleClickSearch = async () => {
    await orderApi
      .searchOrderByEmail(searchValue, token)
      .then((res) => {
        console.log('search success!');
        setOrderList(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log('search faild');
        }
      });
  };
  return (
    <Page title="Foody | Admin">
      <Box sx={{ pb: 5 }} style={{ padding: '15px' }}>
        <Typography variant="h4" gutterBottom>
          Bill
        </Typography>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/dashboard">
              Home
            </Link>
            <Typography color="text.primary">Order</Typography>
          </Breadcrumbs>
        </div>
      </Box>
      <Modal
        title="ORDER DETAIL"
        open={openOrderDetail}
        onCancel={toggle}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          timeout: 500
        }}
      >
        <OrderDetail idOrder={idOrder} />
      </Modal>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All Order" value="1" />
              <Tab label="Orders Pending" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {' '}
            <Container style={{ maxWidth: '1700px' }}>
              <Card>
                <Paper
                  component="form"
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                    margin: 2,
                    border: '1px solid #DCE0E4'
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search ..."
                    onChange={(event) => setSearchValue(event.target.value)}
                  />
                  <IconButton
                    sx={{ p: '10px' }}
                    aria-label="search"
                    onClick={() => {
                      handleClickSearch();
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        // rowCount={USERLIST.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {allOrderList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const {
                              _id,
                              userID,
                              fullName,
                              phoneNumber,
                              email,
                              isPaid,
                              paymentType,
                              status,
                              createdAt,
                              updatedAt
                            } = row;
                            const isItemSelected = selected.indexOf(userID) !== -1;
                            const createDate = formatIsoStringToDate(createdAt);
                            const doneDate = formatIsoStringToDate(updatedAt);

                            return (
                              <TableRow
                                hover
                                key={_id}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell> */}
                                {/* <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '110px'
                                    }}
                                    variant="subtitle2"
                                    noWrap
                                  >
                                    {_id}
                                  </Typography>
                                </TableCell> */}

                                <TableCell style={{ width: '180' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '160px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {fullName}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '100' }}>
                                  <Typography
                                    style={{
                                      width: '180px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {email}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '160px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '70px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {isPaid === true ? (
                                      <Label variant="ghost" color="success">
                                        True
                                      </Label>
                                    ) : (
                                      <Label variant="ghost" color="error">
                                        False
                                      </Label>
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '180px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '90px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    <Label color="primary">{paymentType}</Label>
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '160px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    <Label> {status}</Label>
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '180px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '200px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {`${createDate.dt}/${createDate.month}/${createDate.year} | ${createDate.time}`}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '200px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {`${doneDate.dt}/${doneDate.month}/${doneDate.year} | ${doneDate.time}`}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '250px' }}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<BorderColorIcon />}
                                    color="info"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => {
                                      handleOpenOrderDetail(_id);
                                    }}
                                  >
                                    DETAIL
                                  </Button>
                                  {status === 'PENDING' ? (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<DoneIcon />}
                                      onClick={() => {
                                        handleClickConfirm(_id);
                                      }}
                                    >
                                      CONFIRM
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<DoneIcon />}
                                      disabled
                                    >
                                      CONFIRM
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {isUserNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filterName} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={orderList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Container>
          </TabPanel>
          <TabPanel value="2">
            <Container style={{ maxWidth: '1700px' }}>
              {/* <Typography variant="h4" gutterBottom>
                All Orders
              </Typography> */}
              <Card>
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        // rowCount={USERLIST.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {ordersPending
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const {
                              _id,
                              userID,
                              fullName,
                              phoneNumber,
                              email,
                              isPaid,
                              paymentType,
                              status,
                              createdAt,
                              updatedAt
                            } = row;
                            const isItemSelected = selected.indexOf(userID) !== -1;
                            const createDate = formatIsoStringToDate(createdAt);
                            const doneDate = formatIsoStringToDate(updatedAt);

                            return (
                              <TableRow
                                hover
                                key={_id}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell> */}
                                {/* <TableCell>
                                  <Typography
                                    style={{
                                     
                                      width: '110px'
                                    }}
                                    variant="subtitle2"
                                    noWrap
                                  >
                                    {_id}
                                  </Typography>
                                </TableCell> */}

                                <TableCell style={{ width: '180px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '180px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {fullName}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '100' }}>
                                  <Typography
                                    style={{
                                      width: '180px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {email}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '160px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '70px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {isPaid === true ? (
                                      <Label variant="ghost" color="success">
                                        True
                                      </Label>
                                    ) : (
                                      <Label variant="ghost" color="error">
                                        False
                                      </Label>
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '180px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '90px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    <Label color="primary">{paymentType}</Label>
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '160px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    <Label> {status}</Label>
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '180px' }}>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '200px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {`${createDate.dt}/${createDate.month}/${createDate.year} | ${createDate.time}`}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    style={{
                                      textTransform: 'capitalize',
                                      width: '200px'
                                    }}
                                    variant="subtitle2"
                                  >
                                    {`${doneDate.dt}/${doneDate.month}/${doneDate.year} | ${doneDate.time}`}
                                  </Typography>
                                </TableCell>
                                <TableCell style={{ width: '250px' }}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<BorderColorIcon />}
                                    color="info"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => handleOpenOrderDetail(_id)}
                                  >
                                    DETAIL
                                  </Button>
                                  {status === 'PENDING' ? (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<DoneIcon />}
                                      onClick={() => {
                                        handleClickConfirm(_id);
                                      }}
                                    >
                                      CONFIRM
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<DoneIcon />}
                                      disabled
                                    >
                                      CONFIRM
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {isUserNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filterName} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={orderList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Container>
          </TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <MuiAlert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{
              width: '100%'
            }}
          >
            Great, Confirm Successfully !
          </MuiAlert>
        </Snackbar>

        <Snackbar open={openFailed} autoHideDuration={6000} onClose={handleCloseFailed}>
          <MuiAlert
            onClose={handleCloseFailed}
            severity="error"
            sx={{
              width: '100%'
            }}
          >
            Something went wrong !
          </MuiAlert>
        </Snackbar>
      </Box>
    </Page>
  );
}
