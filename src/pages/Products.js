import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Box,
  Checkbox
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert'; // material
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal'; // components
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Cookies from 'js-cookie';
import { filter } from 'lodash';
import Image from 'material-ui-image';
import { useEffect, useState, useRef } from 'react';
import productApi from '../api/productApi'; // ----------------------------------------------------------------------
import Label from '../components/Label';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import {
  Import,
  UserAdd,
  UserEdit,
  UserListHead,
  UserListToolbar
} from '../components/_dashboard/user'; //
import USERLIST from '../_mocks_/user';

const TABLE_HEAD = [
  {
    id: 'name',
    label: 'Food Name',
    alignRight: false
  },
  {
    id: 'company',
    label: 'Category',
    alignRight: false
  },
  {
    id: 'role',
    label: 'Price',
    alignRight: false
  },
  {
    id: 'isVerified',
    label: 'Description',
    alignRight: false
  },
  {
    id: 'status',
    label: 'Status',
    alignRight: false
  },
  {
    id: 'dateUpdate',
    label: 'Created Date',
    alignRight: false
  },
  {
    id: 'image',
    label: 'Image',
    alignRight: false
  },
  {
    id: 'quantity',
    label: 'Quantity',
    alignRight: false
  },
  {
    id: 'control',
    label: 'Action',
    align: true
  },
  {
    id: 'import',
    label: 'Import',
    alignRight: false
  }
];
const useStyles = makeStyles({
  filter: {
    margin: '-76px 0 20px 670px'
  },
  tableBody: {},
  basicList: {
    position: 'relative',
    top: '-700px',
    width: '100px'
  }
}); // ----------------------------------------------------------------------

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

function Products() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productAction, setProductAction] = useState(false);
  const [isvisible, SetVisible] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const refIsDelete = useRef(false);
  const [value, setValue] = useState('');
  const token = Cookies.get('tokenUser');
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }

    setSelected([]);
  };

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

  const [productList, setProductList] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  useEffect(() => {
    async function fetchProductList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/products?isDeleted=false';
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({
        responseJSON
      });
      const data = responseJSON;
      setProductList(data);
    }
    fetchProductList();
  }, [productAction]);

  useEffect(() => {
    async function getListImage() {
      console.log(productList);
      productList.forEach((item) => {
        productApi.getImageById(item.image);
      });
    }
    getListImage();
  }, [productList]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const filteredUsers = productList;
  const isUserNotFound = filteredUsers.length === 0;
  const filterList = [
    {
      label: 'All'
    },
    {
      label: 'Available'
    },
    {
      label: 'Erorr'
    }
  ];
  const [openAddForm, setOpenAddForm] = useState(false);
  // let open = 'none';

  const handleOpen = () => setOpenAddForm(true);

  const handleClose = () => setOpenAddForm(false);

  const [openEditForm, setOpenEditForm] = useState(false);

  const handleOpenEditForm = () => setOpenEditForm(true);

  const handleCloseEditForm = () => setOpenEditForm(false);

  const [openImportForm, setOpenImportForm] = useState(false);

  const handleOpenImportForm = () => setOpenImportForm(true);

  const handleCloseImportForm = () => setOpenImportForm(false);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const toggle = () => {
    SetVisible(!isvisible);
  };
  const [idDel, setIdDel] = useState();
  const handleClickDelete = async (id) => {
    setOpenDialog(true);
    setIdDel(id);
  };

  const [idSelected, setIdSelected] = useState(null);
  const [idCateSelected, setIdCateSelected] = useState(null);

  const handleClickEdit = (id, idCate) => {
    setIdSelected(id);
    setIdCateSelected(idCate);
  };

  const [idImport, setIdImport] = useState();

  const handleClickImport = (id) => {
    setIdImport(id);
  };
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

  const handleUpdateListProduct = () => {
    setProductAction(!productAction);
  };

  const handleClickOK = async () => {
    setOpenDialog(false);
    const obj = {
      isDeleted: true
    };
    await productApi
      .update(obj, idDel)
      .then((response) => {
        console.log('Delete success !');
        setOpenSuccess(true);
        setProductAction(!productAction);
      })
      .catch((error) => {
        if (error.response) {
          console.log('Delete failed!');
          setOpenFailed(true);
        }
      });
    refIsDelete.current = false;
  };

  const handleClickSearch = async () => {
    await productApi
      .searchProductByName(value, token)
      .then((res) => {
        console.log('search thanh cong');
        console.log(res.data);
        setProductList(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log('search faild');
        }
      });
  };
  return (
    <>
      <Page title="Foody | Admin">
        <Container style={{ maxWidth: '1700px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Box sx={{ pb: 5 }} style={{ padding: 0 }}>
              <Typography variant="h4" gutterBottom>
                Products List
              </Typography>
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/dashboard">
                    Home
                  </Link>
                  <Typography color="text.primary">Products</Typography>
                </Breadcrumbs>
              </div>
            </Box>
            <Button variant="contained" startIcon={<Icon icon={plusFill} />} onClick={handleOpen}>
              New food
            </Button>
            <Modal
              title="Add form"
              open={openAddForm}
              onCancel={toggle}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <UserAdd handleUpdateListProduct={handleUpdateListProduct} />
            </Modal>
            <Modal
              open={openEditForm}
              onClose={handleCloseEditForm}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <UserEdit
                data={idSelected}
                handleUpdateListProduct={handleUpdateListProduct}
                idCate={idCateSelected}
              />
            </Modal>
            <Modal
              open={openImportForm}
              onClose={handleCloseImportForm}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Import
                idImport={idImport}
                handleCloseImport={handleCloseImportForm}
                handleUpdateListProduct={handleUpdateListProduct}
              />
            </Modal>
          </Stack>

          <Card>
            {/* <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            /> */}
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
                onChange={(event) => setValue(event.target.value)}
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
              <TableContainer
                sx={{
                  minWidth: 800
                }}
                className={classes.tableBody}
              >
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          _id,
                          name,
                          description,
                          status,
                          price,
                          createdAt,
                          quantity,
                          image
                        } = row;
                        const { name: categoriesName, _id: idCate } = row.categories[0];
                        const isItemSelected = selected.indexOf(name) !== -1;
                        const date = formatIsoStringToDate(createdAt);
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
                            <TableCell>
                              <Typography
                                style={{
                                  textTransform: 'capitalize',
                                  width: '160px'
                                }}
                                variant="body1"
                                noWrap
                              >
                                {name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography
                                style={{
                                  textTransform: 'capitalize'
                                }}
                                variant="body1"
                              >
                                {categoriesName}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography
                                style={{
                                  textTransform: 'capitalize',
                                  width: '110px'
                                }}
                                variant="body1"
                              >
                                {price}{' '}
                                <span
                                  style={{
                                    color: 'orange'
                                  }}
                                >
                                  VNĐ
                                </span>
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography style={{ width: '250px' }} variant="body1">
                                {description}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={(status === 'published' && 'success') || 'erorr'}
                                style={{ fontSize: '13px' }}
                              >
                                {status}
                              </Label>
                            </TableCell>
                            <TableCell
                              style={{
                                color: '#00AB55'
                              }}
                            >
                              <Typography variant="body1">
                                {`${date.dt}/${date.month}/${date.year} | ${date.time}`}
                              </Typography>
                            </TableCell>
                            <TableCell style={{ width: '200px' }}>
                              <Image
                                src={`https://foody-store-server.herokuapp.com/uploads/${image}.png`}
                                style={{
                                  width: '200px',
                                  height: '200px'
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1">{quantity}</Typography>
                            </TableCell>

                            <TableCell align="center">
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<DeleteIcon />}
                                  color="error"
                                  onClick={() => handleClickDelete(_id)}
                                  style={{ marginBottom: '10px' }}
                                >
                                  Delete
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<EditIcon />}
                                  color="info"
                                  onClick={() => {
                                    handleOpenEditForm();
                                    handleClickEdit(_id, idCate);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton
                                onClick={() => {
                                  handleOpenImportForm();
                                  handleClickImport(_id);
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={6}
                          sx={{
                            py: 3
                          }}
                        >
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
              count={productList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
        {/* <BasicList /> */}
      </Page>
      <Stack
        spacing={2}
        sx={{
          width: '100%'
        }}
      >
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <MuiAlert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{
              width: '100%'
            }}
          >
            Great, Delete Successfully !
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
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Are you sure ?</DialogTitle>
          <DialogContent>
            <DialogContentText>This will delete product data .</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleClickOK}>OK</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
}

export { Products as default };
