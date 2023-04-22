import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext';
import { Button } from '@mui/material';

const NavBar = () => (
  <>
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Company name
        </Typography>
        <nav>
          <AuthStatus />
        </nav>
      </Toolbar>
    </AppBar>
  </>
)

export const AuthStatus = () => {
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    await auth.logout();
  }

  if (!auth.user) {
    return (
      <>
        <Link
          component={RouterLink}
          to="login"
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Login
        </Link>
        <Link
          component={RouterLink}
          to="signup"
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Signup
        </Link>
      </>
    )
  }
  return (
    <>
      <Button
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  )
}


export default NavBar