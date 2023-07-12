import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";
import { TrainingExercise } from "../../types";
import TrainingExerciseCreate from "./TrainingExerciseCreate";

const TrainingExerciseList = () => {
  const [TrainingExercise, setTrainingExercise] = useState<TrainingExercise[]>(
    null!
  );
  const [open, setOpen] = useState(false);
  const { showError, showSuccess } = useAlert();

  const url = "/dashboard/training-exercises";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${url}/${id}`);
      showSuccess("Ejercicio de entrenamiento eliminado correctamente");
      fetchTrainingExercises();
    } catch (error) {
      console.error(error);
      showError("Hubo un error al eliminar el ejercicio de entrenamiento");
    }
  };

  const fetchTrainingExercises = useCallback(async () => {
    const { data } = await axios.get(url);
    setTrainingExercise(data.data);
  }, []);

  useEffect(() => {
    fetchTrainingExercises().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los ejercicios de entrenamiento");
    });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box py={{ xs: 2, lg: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h1" alignSelf="start">
            Ejercicios de entrenamiento
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Crear nuevo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {TrainingExercise?.map((exercise) => (
            <ListItem
              key={exercise.trainingExerciseID}
              disablePadding
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(exercise.trainingExerciseID)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${exercise.name}`} />
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <TrainingExerciseCreate
        open={open}
        handleClose={handleClose}
        fetchTrainingExercises={fetchTrainingExercises}
      />
    </Container>
  );
};

export default TrainingExerciseList;
