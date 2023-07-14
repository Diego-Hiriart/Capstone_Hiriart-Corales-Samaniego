import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import useTab from "../../hooks/useTab";
import AuthStatus from "./AuthStatus";
import { SideBarItems } from "./SideBarItems";

declare module "@mui/material/AppBar" {
  export interface AppBarPropsColorOverrides {
    light: true;
  }
}

const drawerWidth = 240;

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { tabItems } = useTab();

  const navItems = (roles: string[] | undefined) => {
    const items: Record<string, string> = {};
    // Label: path
    if (roles?.includes("admin")) {
      items["Entrenadores"] = "trainer";
      items["Esgrimistas"] = "fencer";
      items["Academia"] = "academy";
      items["Combates"] = "combats";
      items["Configuracion AI"] = "ai-config";
    }
    if (roles?.includes("trainer")) {
      items["Esgrimistas"] = "fencer";
      items["Academia"] = "academy";
      items["Combates"] = "combats";
    }
    if (roles?.includes("fencer")) {
      items["Combates"] = "/combats";
      items["Grupos"] = user?.fencer?.trainingGroupID
        ? `/groups/${user.fencer.trainingGroupID}`
        : `/groups/0`;
      items["Feedback"] = `/feedback`;
      items["Entrenamiento IA"] = `/aitrainings`;
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

            <ListItem key={"/"} disablePadding sx={{ width: "auto" }}>
              <Link
                component={RouterLink}
                to={"/"}
                sx={{ my: 0, p: 2 }}
                underline="none"
              >
                <Typography
                  color="inherit"
                  className="SADSAD"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "black",
                    fontWeight: 500,
                    fontSize: "1.2rem",
                  }}
                >
                  AECQ
                </Typography>
              </Link>
            </ListItem>
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
            {tabItems && <SideBarItems items={tabItems} />}
          </Drawer>
        </Box>
      </Box>
      <Toolbar />
    </>
  );
};

export default NavBar;
