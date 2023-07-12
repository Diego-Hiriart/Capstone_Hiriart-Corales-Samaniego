import styled from "@emotion/styled";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import logoUrl from "/static/images/logo.png";

import AuthContext from "../contexts/AuthContext";
import { LoginFormInputs } from "../types";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.data.message === "Login attempt - User deactivated") {
        setError("root", {
          type: "manual",
          message: "Cuenta desactivada",
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Email o contraseña incorrectos",
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        my={{ xs: 3, sm: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StyledImg src={logoUrl} alt="logo-CAECQ" />
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
        </Box>
      </Box>
    </Container>
  );
}

const StyledImg = styled.img`
  max-width: 80%;
`;
