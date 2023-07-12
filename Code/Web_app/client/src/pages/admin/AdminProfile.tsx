import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";

import ChangePasswordDialog from "../../components/Dialog/ChangePasswordDialog";

const AdminProfile = () => {
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  
  const handleClose = () => {
    setIsChangePasswordDialogOpen(false);
  };

  const handleOpen = () => {
    setIsChangePasswordDialogOpen(true);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box mt={{ xs: 4, sm: 8 }}>
        <Typography variant="h1" alignSelf="start">
          Perfil
        </Typography>
        <Button
          sx={{ mt: 3 }}
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleOpen}
        >
          Cambiar Contraseña
        </Button>
        <ChangePasswordDialog
          open={isChangePasswordDialogOpen}
          handleClose={handleClose}
        />
      </Box>
    </Container>
  );
};

export default AdminProfile;
