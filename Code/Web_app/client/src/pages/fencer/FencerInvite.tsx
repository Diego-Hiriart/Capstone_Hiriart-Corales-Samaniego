import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, DialogActions, FormControlLabel } from "@mui/material";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";
import { FencerInviteForm, schema } from "./validations/FencerInviteValidation";
interface FencerCreateProps {
  handleClose: () => void;
  setInviteLink: (link: string) => void;
}

export default function FencerInvite({
  handleClose,
  setInviteLink,
}: FencerCreateProps) {
  const { showError, showSuccess } = useAlert();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
    watch,
  } = useForm<FencerInviteForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FencerInviteForm> = async (formData) => {
    try {
      if (getValues("isGuest")) {
        // TODO: make all fields optional on invited fencer creation
        await axios.post("/dashboard/user/fencer", formData);
        showSuccess("Esgrimista creado exitosamente");
        handleClose();
      } else {
        const { data } = await axios.post(
          "/dashboard/registration_link/generate",
          { data: formData }
        );
        setInviteLink(data.link);
      }
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
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormControlLabel
            control={<Checkbox {...register("isGuest")} />}
            label="Es Invitado (coming soon)"
            disabled={true}
          />
          <TextField
            required
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
            required
            fullWidth
            margin="normal"
            id="lastNames"
            label="Apellidos"
            {...register("lastNames")}
            error={!!errors.lastNames}
            helperText={errors.lastNames?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            type="email"
            id="email"
            {...register("email")}
            label={watch("isGuest") ? "Email (Opcional)" : "Email *"}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <DialogActions sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Confirmar
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Container>
  );
}
