import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAlert } from "../../hooks/useAlert";
import useAuth from "../../hooks/useAuth";
import axios from "../../services/axios";
import { TrainingExercise } from "../../types";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const schema = z.object({
  exercise: z.number().positive("Campo obligatorio"),
  duration: z.coerce
    .number()
    .positive("Campo obligatorio")
    .max(5, "Máximo 5 minutos"),
});

type NewTrainingDialogType = z.infer<typeof schema>;

const NewTrainingDialog = ({ open, handleClose }: Props) => {
  const [exercises, setExercises] = useState<TrainingExercise[]>([]);
  const { showError } = useAlert();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<NewTrainingDialogType>({
    resolver: zodResolver(schema),
    defaultValues: {
      exercise: 1,
      duration: 1,
    },
  });

  useEffect(() => {
    const fetchExercises = async () => {
      const url = "/dashboard/training-exercises";
      const { data } = await axios.get(url);
      setExercises(data.data);
    };
    fetchExercises().catch((err) => {
      console.log(err);
    });
  }, []);

  const onSubmit: SubmitHandler<NewTrainingDialogType> = async (formData) => {
    try {
      const aiTraining = {
        fencerID: user?.fencer?.fencerID,
        date: new Date(),
        duration: formData.duration,
        trainingExerciseID: formData.exercise,
      };
      const { data } = await axios.post("/dashboard/aitraining", {
        data: aiTraining,
      });
      navigate("/aitrainings/new", {
        state: {
          sessionId: data.data.AITrainingID,
          exercise: getValues().exercise,
          duration: getValues().duration,
        },
      });
    } catch (error) {
      showError("Error al crear el entrenamiento");
      console.error(error);
    }
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
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="exercise-label" label="Ejercicio">
                  {exercises.map((exercise) => (
                    <MenuItem
                      key={exercise.trainingExerciseID}
                      value={exercise.trainingExerciseID}
                    >
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
            <Button fullWidth variant="contained" type="submit">
              Confirmar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTrainingDialog;
