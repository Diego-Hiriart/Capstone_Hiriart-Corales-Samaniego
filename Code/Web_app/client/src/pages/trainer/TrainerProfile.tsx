import { useParams } from "react-router-dom";
import axios from "../../services/axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "../../hooks/useAlert";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

const schema = z.object({
  names: z.string().nonempty({ message: "Campo requerido" }),
  lastNames: z.string().nonempty({ message: "Campo requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  experience: z.string().optional(),
  weapon: z.string().optional(),
  // pictureURL: z.string().optional(),
});

type UpdateTrainerForm = z.infer<typeof schema>;

const TrainerProfile = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useAlert();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
    control,
  } = useForm<UpdateTrainerForm>({
    resolver: zodResolver(schema),
    defaultValues: async () => {
      const { data } = await axios.get(`/dashboard/trainer/${id}`);
      const trainer = data.data;
      return {
        names: trainer.user.names,
        lastNames: trainer.user.lastNames,
        email: trainer.user.email,
        experience: trainer.experience,
        weapon: trainer.weapon,
      };
    },
  });

  interface IObjectKeys {
    [key: string]: string | undefined;
  }

  const onSubmit: SubmitHandler<UpdateTrainerForm> = async (formData) => {
    try {
      // TODO: extract to helper function
      const updatedData = Object.keys(dirtyFields).reduce<IObjectKeys>((acc, key) => {
        acc[key] = formData[key as keyof UpdateTrainerForm];
        return acc;
      }, {});
      if (Object.keys(updatedData).length === 0) return;

      await axios.put(`/dashboard/trainer/${id}`, { data: updatedData });
      showSuccess("Entrenador actualizado exitosamente");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          showError("Ha ocurrido un error al actualizar el entrenador");
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
        {/* TODO: add iamge field */}
        <Typography variant="h1" alignSelf="start">
          Perfil
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Trayectoria"
            id="trayectoria"
            {...register("experience")}
          />
          <Controller
            name="weapon"
            control={control}
            defaultValue=""
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
                    value="espada"
                    control={<Radio />}
                    label="Espada"
                  />
                  <FormControlLabel
                    value="sable"
                    control={<Radio />}
                    label="Sable"
                  />
                  <FormControlLabel
                    value="florete"
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
            Guardar Cambios
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TrainerProfile;
