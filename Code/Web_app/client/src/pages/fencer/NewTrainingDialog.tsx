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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const schema = z.object({
  exercise: z.string().nonempty("Campo obligatorio"),
  duration: z.number().positive("Campo obligatorio").max(10, "Máximo 10"),
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
  const handleChange = () => {};

  const {
    control,
    formState: { errors },
  } = useForm<NewTrainingDialogType>({
    resolver: zodResolver(schema),
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Nuevo entrenamiento</DialogTitle>
      <DialogContent>
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
          fullWidth
          margin="normal"
          type="number"
          label="Duración en minutos"
          id="duration"
          name="duration"
          onChange={handleChange}
        />
        <DialogActions sx={{ mt: 3 }}>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button fullWidth variant="contained" onClick={handleClose}>
            Confirmar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NewTrainingDialog;
