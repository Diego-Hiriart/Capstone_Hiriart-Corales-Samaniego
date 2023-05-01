import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Button } from "@mui/material";

const NavBar = () => {
  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Capstone
          </Typography>
          <nav>
            <AuthStatus />
          </nav>
        </Toolbar>
      </AppBar>
    </>
  );
};

export const AuthStatus = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <>
        <Link
          component={RouterLink}
          to="login"
          variant="button"
          color="text.primary"
          sx={{ my: 1, mx: 1.5 }}
        >
          Login
        </Link>
        <Link
          component={RouterLink}
          to="signup"
          variant="button"
          color="text.primary"
          sx={{ my: 1, mx: 1.5 }}
        >
          Signup
        </Link>
      </>
    );
  }
  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default NavBar;
