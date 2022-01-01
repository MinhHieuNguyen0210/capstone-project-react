import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import {
  Button,
  Card,
  Container,
  ListItemIcon,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Box
} from '@material-ui/core'; // components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert'; // material\
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Image from 'material-ui-image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';
import { filter } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import categoriesApi from '../api/categoriesApi'; //
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';

import { CategoriesAdd, CategoriesEdit } from '../components/_dashboard/categories';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
import USERLIST from '../_mocks_/user'; // ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: 'id',
    label: '_ID',
    alignRight: false
  },
  {
    id: 'name',
    label: 'Category name',
    alignRight: false
  },
  {
    id: 'slug',
    label: 'Slug',
    alignRight: false
  },
  {
    id: 'createAt',
    label: 'Created At',
    alignRight: false
  },
  {
    id: 'updateAt',
    label: 'Updated At',
    alignRight: false
  },
  {
    id: 'iamge',
    label: 'Image',
    alignRight: false
  },
  {
    id: 'control',
    label: 'Action',
    align: true
  }
]; // ----------------------------------------------------------------------

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

function Categories() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [categoriesAction, setCategoriestAction] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const refIsDelete = useRef(false);
  const [value, setValue] = useState('');
  const token = Cookies.get('tokenUser');

  const handleOpen = () => setOpenAddForm(true);

  const handleClose = () => setOpenAddForm(false);

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

  const [openEditForm, setOpenEditForm] = useState(false);

  const handleOpenEditForm = () => setOpenEditForm(true);

  const handleCloseEditForm = () => setOpenEditForm(false);

  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    async function fetchCategoriesList() {
      const requestUrl = 'https://foody-store-server.herokuapp.com/categories?isDeleted=false';
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log({
        responseJSON
      });
      const data = responseJSON;
      setCategoriesList(data);
    }

    fetchCategoriesList();
  }, [categoriesAction]);

  useEffect(() => {
    async function getListImage() {
      categoriesList.forEach((item) => {
        categoriesApi.getImageById(item.image);
      });
    }
    getListImage();
  }, [categoriesList]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const filteredUsers = categoriesList;
  const isUserNotFound = filteredUsers.length === 0;
  const [idSelected, setIdSelected] = useState(null);
  const [idProductSelected, setIdProductSelected] = useState(null);
  const handleClickEdit = (id, idProduct) => {
    setIdSelected(id);
    setIdProductSelected(idProduct);
  };

  const [open, setOpen] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const [idDel, setIdDel] = useState();
  const handleClickDelete = (id) => {
    setOpenDialog(true);
    setIdDel(id);
  };
  const handleClickOK = async () => {
    setOpenDialog(false);
    const obj = {
      isDeleted: true
    };
    await categoriesApi
      .update(obj, idDel)
      .then((response) => {
        console.log('Delete success !');
        setOpenSuccess(true);
        handleUpdateListCategories();
        console.log(open);
      })
      .catch((error) => {
        if (error.response) {
          console.log('Delete failed!');
          setOpenFailed(false);
        }
      });
    refIsDelete.current = false;
    // if (open === 'success') {
    //   setOpenSuccess(true);
    // }

    // if (open === 'error') {
    //   setOpenFailed(true);
    // }
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

  const handleUpdateListCategories = () => {
    setCategoriestAction(!categoriesAction);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickSearch = () => {
    console.log(value);
    categoriesApi
      .searchByName(value, token)
      .then((response) => {
        console.log('search thanh cong');
        console.log(response.data);
        setCategoriesList(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log('search failed');
        }
      });
  };

  return (
    <>
      <Page title="Foody | Admin">
        <Container style={{ maxWidth: '1200px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Box sx={{ pb: 5 }} style={{ padding: 0 }}>
              <Typography variant="h4" gutterBottom>
                Food category
              </Typography>
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/dashboard">
                    Home
                  </Link>
                  <Typography color="text.primary">Category</Typography>
                </Breadcrumbs>
              </div>
            </Box>
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={handleOpen}
            >
              New Category
            </Button>
            <Modal
              open={openAddForm}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CategoriesAdd handleUpdateListCategories={handleUpdateListCategories} />
            </Modal>
            <Modal
              open={openEditForm}
              onClose={handleCloseEditForm}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CategoriesEdit
                data={idSelected}
                idProduct={idProductSelected}
                handleUpdateListCategories={handleUpdateListCategories}
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
                        const { _id, name, slug, createdAt, updatedAt, image } = row;
                        let IDProduct;
                        if (row.products[0] !== undefined) {
                          const { _id: idProduct } = row.products[0];
                          IDProduct = idProduct;
                        }
                        const isItemSelected = selected.indexOf(name) !== -1;
                        const createAt = formatIsoStringToDate(createdAt);
                        const updateAt = formatIsoStringToDate(updatedAt);
                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell>
                              <Typography variant="subtitle2" noWrap>
                                {_id}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{name}</TableCell>
                            <TableCell align="left">{slug}</TableCell>
                            <TableCell
                              align="left"
                              style={{
                                color: '#00AB55'
                              }}
                            >
                              {`${createAt.dt}/${createAt.month}/${createAt.year} | ${createAt.time}`}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                color: '#00AB55'
                              }}
                            >
                              {`${updateAt.dt}/${updateAt.month}/${updateAt.year} | ${updateAt.time}`}
                            </TableCell>
                            <TableCell>
                              <Image
                                src={`https://foody-store-server.herokuapp.com/uploads/${image}.png`}
                                style={{
                                  width: '100px',
                                  height: '100px'
                                }}
                              />
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
                                    handleClickEdit(_id, IDProduct);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
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
              count={categoriesList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
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

export { Categories as default };
