import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    light: Palette["primary"];
  }
  interface PaletteOptions {
    light: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      color: "#4A4A4A",
      fontSize: "2rem",
      fontWeight: 700,
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
  },
  palette: {
    primary: {
      main: "#770014",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    light: {
      main: "#FFFFFF",
    },
  },
});

export default theme;
