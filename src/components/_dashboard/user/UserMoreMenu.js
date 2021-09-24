import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function UserMoreMenu() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MenuItem sx={{ color: 'text.secondary' }} style={{ width: '50px' }}>
        <ListItemIcon>
          <Icon icon={trash2Outline} width={24} height={24} />
        </ListItemIcon>
        {/* <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} /> */}
      </MenuItem>

      <MenuItem
        component={RouterLink}
        to="#"
        sx={{ color: 'text.secondary' }}
        style={{ width: '50px' }}
      >
        <ListItemIcon>
          <Icon icon={editFill} width={24} height={24} />
        </ListItemIcon>
        {/* <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} /> */}
      </MenuItem>
    </>
  );
}
