import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const schema = z.object({
  exercise: z.string().nonempty("Campo obligatorio"),
  duration: z.coerce.number().positive("Campo obligatorio").max(10, "Máximo 10 minutos"),
});

type NewTrainingDialogType = z.infer<typeof schema>;

const exercises = {
  data: [
    {
      id: "1",
      name: "Fleche",
    },
    {
      id: "2",
      name: "Parry",
    },
    {
      id: "3",
      name: "Reposte",
    },
  ],
};

const NewTrainingDialog = ({ open, handleClose }: Props) => {
  const navigate = useNavigate();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<NewTrainingDialogType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = () => {
    navigate("/aitrainings/new", { state: { exercise: getValues().exercise } });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Nuevo entrenamiento</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal" error={!!errors.exercise}>
            <InputLabel id="exercise-label">Ejercicio</InputLabel>
            <Controller
              name="exercise"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="exercise-label" label="Ejercicio">
                  {exercises.data.map((exercise) => (
                    <MenuItem key={exercise.id} value={exercise.name}>
                      {exercise.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.exercise?.message}</FormHelperText>
          </FormControl>
          <TextField
            {...register("duration")}
            fullWidth
            margin="normal"
            type="number"
            label="Duración en minutos"
            id="duration"
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
          <DialogActions sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              type="submit"
            >
              Confirmar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTrainingDialog;
