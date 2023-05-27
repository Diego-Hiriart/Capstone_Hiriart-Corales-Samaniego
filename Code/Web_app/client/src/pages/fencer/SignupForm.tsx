import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignupForm } from "../../types";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useAlert } from "../../hooks/useAlert";
import { AxiosError } from "axios";

export default function SignupForm() {
  const { signup } = useContext(AuthContext);
  const { showSuccess, showError } = useAlert();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<SignupForm>();

  const onSubmit: SubmitHandler<SignupForm> = async (formData) => {
    try {
      await signup(formData);
      showSuccess("Usuario creado exitosamente");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          showError("Ha ocurrido un error al crear el esgrimista")
        }
      }
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
            type="email"
            id="email"
            label="Email"
            {...register("email", {
              required: "Campo requerido",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email inválido",
              },
            })}
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
              minLength: {
                value: 8,
                message: "Contraseña debe tener mínimo 8 caracteres",
              },
              maxLength: {
                value: 20,
                message: "Contraseña debe tener máximo 20 caracteres",
              },
              // TODO: add regex for password strength
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
            {...register("confirmPassword", {
              required: "Campo requerido",
              validate: (val: string) => {
                if (watch("password") != val) {
                  return "Las contraseñas no coinciden";
                }
              },
            })}
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
