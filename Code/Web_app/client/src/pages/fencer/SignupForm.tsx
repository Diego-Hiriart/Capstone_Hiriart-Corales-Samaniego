import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAlert } from "../../hooks/useAlert";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import axios from "../../services/axios";
import { schema,SignupFormType } from "./validations/SignupFormValidation";

export default function SignupForm() {
  const { multiFormState, setMultiFormState, setRegistrationToken } =
    useMultiStepForm();
  const { showError } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormType>({
    defaultValues: multiFormState,
    resolver: zodResolver(schema),
  });

  // TODO: move this logic to SignupContextRoute
  useEffect(() => {
    if (!searchParams.has("t")) return;
    setRegistrationToken(searchParams.get("t"));
  }, []);

  const onSubmit: SubmitHandler<SignupFormType> = async (formData) => {
    try {
      await axios.post("auth/verifyEmail", { email: formData.email });
      setMultiFormState({ ...multiFormState, ...formData });
      navigate("/signup/personal");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          showError("Ha ocurrido un error al crear el esgrimista");
        }
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
            {...register("names")}
            error={!!errors.names}
            helperText={errors.names?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            id="lastNames"
            label="Apellidos"
            {...register("lastNames")}
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
            {...register("email")}
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
            {...register("password")}
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
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Siguiente
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
