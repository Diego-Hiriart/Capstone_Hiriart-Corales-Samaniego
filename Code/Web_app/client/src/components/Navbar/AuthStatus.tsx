import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Avatar, Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const AuthStatus = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setAnchorElUser(null);
    await logout();
  };

  if (user) {
    return (
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "end" }}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
          />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem component={RouterLink} to="perfil">
            Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    );
  }
  return null;
};

export default AuthStatus;
