import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Checkbox,
  Typography,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BuildIcon from '@mui/icons-material/Build';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MuiAlert from '@mui/material/Alert'; // material
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Cookies from 'js-cookie';
import { useEffect, useState, useRef } from 'react';
import userApi from '../api/userApi'; // ----------------------------------------------------------------------
import Label from '../components/Label';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';

import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
import ChangePassword from '../components/_dashboard/account/ChangePassword';
import USERLIST from '../_mocks_/user';

const TABLE_HEAD = [
  {
    id: 'namid',
    label: '_Id',
    alignRight: false
  },
  {
    id: 'username',
    label: 'Username',
    alignRight: false
  },
  {
    id: 'email',
    label: 'Email',
    alignRight: false
  },
  {
    id: 'creatAt',
    label: 'Create Date',
    alignRight: false
  },
  {
    id: 'role',
    label: 'Role',
    alignRight: false
  },
  {
    id: 'blocked',
    label: 'Status',
    alignRight: false
  },
  {
    id: 'control',
    label: 'Action',
    align: true
  },
  {
    id: 'changePassword',
    label: 'Password',
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

function Account() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userAction, setUserAction] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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

  const [accountList, setaccountList] = useState([]);
  const token = Cookies.get('tokenUser');
  useEffect(() => {
    async function getAllUser() {
      const respone = await userApi.getAllUser(token);
      console.log(respone.data);
      setaccountList(respone.data);
    }

    getAllUser();
  }, [userAction]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const filteredUsers = accountList;
  const isUserNotFound = filteredUsers.length === 0;

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFailed = () => {
    setOpenFailed(false);
  };

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const refIsDelete = useRef(false);
  const [idLock, setIdLock] = useState();
  const handleClickLockUser = (id) => {
    setOpenDialog(true);
    setIdLock(id);
  };

  const handleClickUnlockUser = async (id) => {
    const data = { blocked: false };
    await userApi
      .editUser(id, data, token)
      .then(() => {
        console.log('unlock user success');
        setOpenSuccess(true);
        setUserAction(!userAction);
      })
      .catch((error) => {
        if (error.response) {
          console.log('unlock user failed');
          setOpenFailed(true);
        }
      });
  };
  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const [idUser, setIdUser] = useState();

  const handleClickChangePassword = (id) => {
    setIdUser(id);
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
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClickOK = async () => {
    setOpenDialog(false);
    refIsDelete.current = true;
    if (refIsDelete.current === true) {
      const data = { blocked: true };
      await userApi
        .editUser(idLock, data, token)
        .then(() => {
          console.log('lock user success');
          setOpenSuccess(true);
          setUserAction(!userAction);
        })
        .catch((error) => {
          if (error.response) {
            console.log('lock user failed');
            setOpenFailed(true);
          }
        });
      refIsDelete.current = false;
    }
    console.log(refIsDelete);
  };
  return (
    <>
      <Page title="Foody | Admin">
        <Container style={{ maxWidth: '1700px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Box sx={{ pb: 5 }} style={{ padding: 0 }}>
              <Typography variant="h4" gutterBottom>
                Accounts
              </Typography>
              <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/dashboard">
                    Home
                  </Link>
                  <Typography color="text.primary">Accounts</Typography>
                </Breadcrumbs>
              </div>
            </Box>
          </Stack>
          <Modal
            open={openChangePassword}
            onClose={handleCloseChangePassword}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ChangePassword idUser={idUser} />
          </Modal>
          <Card>
            {/* <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            /> */}

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
                    style={{ backgroundColor: 'blue' }}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { _id, username, email, blocked, createdAt } = row;
                        const { name } = row.role;
                        const date = formatIsoStringToDate(createdAt);
                        const isItemSelected = selected.indexOf(name) !== -1;
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
                                  width: '110px'
                                }}
                                variant="subtitle2"
                                noWrap
                              >
                                {_id}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {username}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {email}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography
                                variant="subtitle2"
                                noWrap
                                style={{
                                  color: '#00AB55'
                                }}
                              >
                                {`${date.dt}/${date.month}/${date.year} | ${date.time}`}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </TableCell>
                            <TableCell
                              style={{
                                color: '#00AB55'
                              }}
                            >
                              {blocked !== true ? (
                                <Label variant="ghost" color="success">
                                  ACTIVE
                                </Label>
                              ) : (
                                <Label color="error"> BLOCKED</Label>
                              )}
                            </TableCell>

                            <TableCell align="left" width="200">
                              {blocked !== true ? (
                                <Button
                                  variant="contained"
                                  onClick={() => handleClickLockUser(_id)}
                                  endIcon={<LockIcon />}
                                  size="small"
                                  color="error"
                                >
                                  LOCK USER
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleClickUnlockUser(_id)}
                                  endIcon={<LockOpenIcon />}
                                >
                                  UNLOCK USER{' '}
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="changepassword"
                                onClick={() => {
                                  handleOpenChangePassword();
                                  handleClickChangePassword(_id);
                                }}
                              >
                                <BuildIcon />
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
              count={accountList.length}
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
            Great, Successfully !
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
            <DialogContentText>This will lock user account.</DialogContentText>
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

export { Account as default };
