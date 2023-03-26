import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Outlet, Link as RouterLink } from 'react-router-dom';

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
        </nav>
      </Toolbar>
    </AppBar>
    <div>
      <Outlet />
    </div>
  </>
)

export default NavBar