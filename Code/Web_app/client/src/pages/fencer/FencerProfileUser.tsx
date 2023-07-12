import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import ChangePasswordDialog from "../../components/Dialog/ChangePasswordDialog";
import AuthContext from "../../contexts/AuthContext";
import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";
import { SignupFormType } from "./validations/SignupFormValidation";

const schema = z.object({
  names: z.string().nonempty({ message: "Campo requerido" }),
  lastNames: z.string().nonempty({ message: "Campo requerido" }),
  email: z.string().email({ message: "Email inválido" }),
});

export default function FencerProfileUser() {
  const { showError, showSuccess } = useAlert();
  const { user } = useContext(AuthContext);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

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

  const handleClose = () => {
    setIsChangePasswordDialogOpen(false);
  };

  const handleOpen = () => {
    setIsChangePasswordDialogOpen(true);
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
          <Button
            sx={{ mt: 3 }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleOpen}
          >
            Cambiar Contraseña
          </Button>
          <Button
            sx={{ mt: 3 }}
            type="submit"
            fullWidth
            variant="contained"
            disabled={!!dirtyFields && Object.keys(dirtyFields).length === 0}
          >
            Guardar Cambios
          </Button>
        </Box>
        <ChangePasswordDialog
          open={isChangePasswordDialogOpen}
          handleClose={handleClose}
        />
      </Box>
    </Container>
  );
}
