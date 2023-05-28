import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAlert } from "../../hooks/useAlert";
import { AxiosError } from "axios";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import { SignupFormType, schema } from "./validations/SignupFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupForm() {
  const { multiFormState, setMultiFormState } = useMultiStepForm();
  const { showError } = useAlert();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormType>({
    defaultValues: multiFormState,
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (formData) => {
    try {
      // TODO: make request to verify email
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
