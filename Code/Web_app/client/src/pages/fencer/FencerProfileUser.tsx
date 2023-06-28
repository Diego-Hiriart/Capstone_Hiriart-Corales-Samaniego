import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAlert } from "../../hooks/useAlert";
import { AxiosError } from "axios";
import { SignupFormType } from "./validations/SignupFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../services/axios";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Stack } from "@mui/material";
import { z } from "zod";

const schema = z.object({
  names: z.string().nonempty({ message: "Campo requerido" }),
  lastNames: z.string().nonempty({ message: "Campo requerido" }),
  email: z.string().email({ message: "Email inválido" }),
});

export default function FencerProfileUser() {
  const { showError, showSuccess } = useAlert();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<SignupFormType>({
    defaultValues: { ...user },
    resolver: zodResolver(schema),
  });

  interface IObjectKeys {
    [key: string]: string | undefined | null;
  }

  const onSubmit: SubmitHandler<SignupFormType> = async (formData) => {
    try {
      const updatedData = Object.keys(dirtyFields).reduce<IObjectKeys>(
        (acc, key) => {
          acc[key] = formData[key as keyof SignupFormType];
          return acc;
        },
        {}
      );

      // if no fields were changed, don't send the request
      if (Object.keys(updatedData).length === 0) return;

      await axios.put(`/dashboard/user/${user?.userID}`, { data: updatedData });
      showSuccess("Perfil actualizado correctamente");
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
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!!dirtyFields && Object.keys(dirtyFields).length === 0}
            >
              Guardar Cambios
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
