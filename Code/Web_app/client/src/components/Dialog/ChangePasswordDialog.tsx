import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "../../hooks/useAlert";
import useAuth from "../../hooks/useAuth";
import axios from "../../services/axios";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const schema = z.object({
  currentPassword: z.string().nonempty({ message: "Campo requerido" }),
  newPassword: z.string().nonempty({ message: "Campo requerido" }),
});

type ChangePasswordDialogType = z.infer<typeof schema>;

const ChangePasswordDialog = ({ open, handleClose }: Props) => {
  const { user } = useAuth();
  const { showError, showSuccess } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordDialogType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: ChangePasswordDialogType) => {
    try {
      await axios.put(`/dashboard/user/${user?.userID}/change-password`, {
        email: user?.email,
        data: formData,
      });
      showSuccess("Contraseña cambiada correctamente");
      reset();
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("currentPassword", {
            type: "manual",
            message: "Contraseña incorrecta",
          });
          return;
        }
      }
      showError("Hubo un error al cambiar la contraseña");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("currentPassword")}
            fullWidth
            margin="normal"
            id="currentPassword"
            label="Contraseña Actual"
            type="password"
            autoFocus
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            {...register("newPassword")}
            fullWidth
            margin="normal"
            id="newPassword"
            label="Nueva Contraseña"
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <DialogActions sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>
            <Button fullWidth variant="contained" type="submit">
              Confirmar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
