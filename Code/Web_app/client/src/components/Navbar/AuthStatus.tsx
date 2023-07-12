import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";

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
          {user?.roles?.includes("admin") && (
            <MenuItem component={RouterLink} to="/admin/profile">
              Perfil Admin
            </MenuItem>
          )}
          {user?.roles?.includes("trainer") && (
            <MenuItem component={RouterLink} to="/profile">
              Perfil Trainer
            </MenuItem>
          )}
          {user?.roles?.includes("fencer") && (
            <MenuItem component={RouterLink} to="/profile">
              Perfil Fencer
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    );
  }
  return null;
};

export default AuthStatus;
