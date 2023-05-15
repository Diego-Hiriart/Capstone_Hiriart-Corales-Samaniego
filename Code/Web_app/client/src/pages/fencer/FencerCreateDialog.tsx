import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../../services/axios";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    names: z.string().nonempty({ message: "Campo requerido" }),
    lastNames: z.string().nonempty({ message: "Campo requerido" }),
    email: z.string().email({ message: "Email inválido" }),
    isGuest: z.boolean(),
  });

type RegisterFencerForm = z.infer<typeof schema>;

interface CreateTrainerDialogProps {
  handleClose: () => void;
  open: boolean;
}

export default function CreateTrainerDialog({open, handleClose}: CreateTrainerDialogProps) {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFencerForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterFencerForm> = async (formData) => {
    try {
      await axios.post("/dashboard/user/trainer", {data: formData});
      // TODO: redirect to trainers list
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          setError("root", {
            type: "manual",
            message: "Ha ocurrido un error al crear el entrenador",
          });
        }
      }
    }
  };

  // TODO: add root error component
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear Esgrimista</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* TODO: add back button */}
            {/* TODO: add iamge field */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
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
              <FormControlLabel control={<Checkbox />} label="Es Invitado" />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Crear Esgrimista
              </Button>
              <Button fullWidth variant="outlined" onClick={handleClose}>Cancelar</Button>
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
