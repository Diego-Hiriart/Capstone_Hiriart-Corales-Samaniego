import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AuthStatus from "./AuthStatus";

declare module "@mui/material/AppBar" {
  export interface AppBarPropsColorOverrides {
    light: true;
  }
}

const drawerWidth = 240;

const navItems = (roles: string[] | undefined) => {
  // Label: path object
  const items: Record<string, string> = {};
  if (roles?.includes("admin")) {
    items["Entrenadores"] = "trainer";
    items["Esgrimistas"] = "fencer";
  }
  if (roles?.includes("trainer")) {
    items["Esgrimistas"] = "fencers";
  }
  if (roles?.includes("fencer")) {
    items["Grupos"] = "groups";
  }
  return items;
};

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navLinks = navItems(user?.roles);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        color="light"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar>
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Capstone
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" }, mx: 2 }}>
            {Object.keys(navLinks).map((link) => (
              <Button key={link} component={RouterLink} to={navLinks[link]}>
                {link}
              </Button>
            ))}
          </Box>
          <AuthStatus />
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Capstone
            </Typography>
            <Divider />
            <List>
              {Object.keys(navLinks).map((link) => (
                <ListItem key={link} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={navLinks[link]}
                    sx={{ py: -1, my: 0 }}
                  >
                    <ListItemText primary={link} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default NavBar;