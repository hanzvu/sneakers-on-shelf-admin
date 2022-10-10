import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Button } from '@mui/material';


// component

import Modal from 'react-bootstrap/Modal';
import Iconify from '../../../components/Iconify';
import FromCreate from '../../../sosProduct/layouts/FormUpdate';
// ----------------------------------------------------------------------

export default function ProductMoreMenu() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Button variant="contained" component={RouterLink} startIcon={<Iconify icon="eva:plus-fill" />}>
              <a className="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root"
                tabIndex="0" href="/dashboard/productUpdate" style={{ textDecoration: 'none', color: 'white' }}>
                Update Product
              </a>
            </Button>

          </ListItemIcon>

        </MenuItem>
      </Menu>
      <Modal size="xl" show={show} onHide={handleClose} >
        <FromCreate />
      </Modal>
    </>
  );
}
