import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
import { SideBarLinks } from "./SideBarLinks";

declare module "@mui/material/AppBar" {
  export interface AppBarPropsColorOverrides {
    light: true;
  }
}

const drawerWidth = 240;

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navItems = (roles: string[] | undefined) => {
    const items: Record<string, string> = {};
    // Label: path
    if (roles?.includes("admin")) {
      items["Entrenadores"] = "trainer";
      items["Esgrimistas"] = "fencer";
      items["Actividades"] = "activity";
      items["Combates"] = "combats";
    }
    if (roles?.includes("trainer")) {
      items["Esgrimistas"] = "fencer";
      items["Actividades"] = "activity";
      items["Combates"] = "combats";
    }
    if (roles?.includes("fencer")) {
      items["Combates"] = "combats";
      items["Grupos"] = `groups/${user?.fencer?.trainingGroupID}`;
      items["Feedback"] = `/fencer/${user?.fencer?.fencerID}/feedback`;
      items[
        "Entrenamiento IA"
      ] = `/fencer/${user?.fencer?.fencerID}/aitrainings`;
    }
    return items;
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navLinks = navItems(user?.roles);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          component="nav"
          color="light"
          elevation={0}
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
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
            <Toolbar />
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
            <Divider />
            <SideBarLinks />
          </Drawer>
        </Box>
      </Box>
      <Toolbar />
    </>
  );
};

export default NavBar;
