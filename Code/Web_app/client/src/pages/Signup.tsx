import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInputs {
  names: string;
  lastNames: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      names: data.names,
      lastNames: data.lastNames,
      email: data.email,
      password: data.password,
    });
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
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            fullWidth
            margin="normal"
            id="names"
            label="Nombres"
            autoFocus
            {...register("names", { required: "Campo requerido" })}
            error={!!errors.names}
            helperText={errors.names?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            id="lastNames"
            label="Apellidos"
            {...register("lastNames", { required: "Campo requerido" })}
            error={!!errors.lastNames}
            helperText={errors.lastNames?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="email"
            label="Email"
            {...register("email", { required: "Campo requerido" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Contraseña"
            type="password"
            id="password"
            {...register("password", {
              required: "Campo requerido",
              minLength: 8,
              maxLength: 20,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // 1 mayúscula, 1 minúscula, 1 número, mínimo 8 caracteres
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Confirmar Contraseña"
            type="password"
            id="confirm-password"
            {...register("confirmPassword", { required: "Campo requerido" })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
