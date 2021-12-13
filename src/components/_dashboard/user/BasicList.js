import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListSubheader from '@mui/material/ListSubheader';

const useStyles = makeStyles({
  modifyList: {}
});
export default function BasicList() {
  const classes = useStyles();
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 200,
        bgcolor: '#fff',
        p: 2,
        border: '1px solid #F3F5F7',
        borderRadius: '5px',
        position: 'fixed',
        top: '292px',
        padding: 0
      }}
    >
      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Categories List
        </ListSubheader>
        <ListItem disablePadding>
          <ListItemButton>
            {/* <ListItemIcon>
              <ArrowForwardIosIcon />
            </ListItemIcon> */}
            <ListItemText primary="Fast food" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Traditional food" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Rice" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Noodle" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
