import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AxiosError } from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";

const schema = z
  .object({
    names: z.string().nonempty({ message: "Campo requerido" }),
    lastNames: z.string().nonempty({ message: "Campo requerido" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
    confirmPassword: z.string().nonempty({ message: "Campo requerido" }),
    experience: z.string().optional(),
    weapon: z.string().optional(),
    // pictureURL: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterTrainerForm = z.infer<typeof schema>;

export default function CreateTrainer() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<RegisterTrainerForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterTrainerForm> = async (formData) => {
    try {
      await axios.post("/dashboard/user/trainer", {data: formData});
      showSuccess("Entrenador creado exitosamente");
      navigate("/trainer");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          showError("Ha ocurrido un error al crear el entrenador")
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        mt={{ xs: 4, sm: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TODO: add back button */}
        {/* TODO: add iamge field */}
        <Typography variant="h1" alignSelf="start">
          Nuevo Entrenador
        </Typography>
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
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Trayectoria"
            id="trayectoria"
            defaultValue={""}
            {...register("experience")}
          />
          <Controller
            name="weapon"
            defaultValue="Espada"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Arma</FormLabel>
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value="Espada"
                    control={<Radio />}
                    label="Espada"
                  />
                  <FormControlLabel
                    value="Sable"
                    control={<Radio />}
                    label="Sable"
                  />
                  <FormControlLabel
                    value="Florete"
                    control={<Radio />}
                    label="Florete"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
