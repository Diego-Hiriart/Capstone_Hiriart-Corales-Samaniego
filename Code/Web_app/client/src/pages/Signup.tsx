import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from 'axios';

export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('http://localhost:3000/api/auth/signup', {
      names: data.get("names"),
      lastNames: data.get("lastNames"),
      email: data.get("email"),
      password: data.get("password"),
    })
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Registro
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            autoComplete="given-name"
            name="names"
            id="names"
            label="Nombres"
            autoFocus
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="lastNames"
            label="Apellidos"
            name="lastNames"
            autoComplete="family-name"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirm-password"
            autoComplete="confirm-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" href="#" variant="body2">
                Ya tienes cuenta? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
