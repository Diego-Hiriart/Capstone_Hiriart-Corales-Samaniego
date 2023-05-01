import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LoginFormInputs } from "../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Alert } from "@mui/material";

export default function Login() {
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    try {
      await login(formData);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Email o contraseña incorrectos",
      });
    }
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
          Log in
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          {errors.root?.message && (
            <Alert severity="error">{errors.root?.message}</Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            autoFocus
            {...register("email", { required: "Campo requerido" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            id="password"
            {...register("password", { required: "Campo requerido" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component={RouterLink}
                to="/signup"
                href="#"
                variant="body2"
              >
                No estas registrado? Registrate
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}