import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { AITraining } from "../../types";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import AIErrorDialog from "./AIErrorDialog";

const AITrainingDetail = () => {
  // const [training, setTraining] = useState<AITraining | null>(null);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedErrorID, setSelectedErrorID] = useState<number | null>(null);

  useEffect(() => {
    // const fetchTraining = async () => {
    //   const { data } = await axios.get(`/dashboard/aitraining/${id}`);
    //   setTraining(data.data);
    // }
    // fetchTraining();
  });

  const handleClose = () => {
    setSelectedErrorID(null);
  }
  const handleOpen = (id: number) => {
    setSelectedErrorID(id);
    setOpen(true);
  };

  const training = {
    AITraining: 1,
    date: new Date(),
    exercise: "Fleche",
    duration: 5,
    errors: [
      {
        id: 1,
        error: "Posición incorrecta",
        description: "El esgrimista no se encuentra en la posición correcta",
      },
    ],
    feedback: "El esgrimista debe mejorar su posición",
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Typography variant="h1">
          Entrenamiento {training?.AITraining}
        </Typography>
        <Typography>
          Fecha: {String(dayjs(training?.date).format("DD/MM/YYYY"))}
        </Typography>
        <Typography>Ejercicio: {training?.exercise}</Typography>
        <Typography variant="h5" mt={5}>
          Errores
        </Typography>
        <List>
          {training?.errors.map((error) => (
            <ListItem key={error.id} disablePadding divider>
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleOpen(error.id)}
              >
                <ListItemText primary={error.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: add pagination */}
        <Typography variant="h5" mt={5}>
          Feedback
        </Typography>
        <Typography>{training?.feedback}</Typography>
      </Box>

      {selectedErrorID && (
        <AIErrorDialog
          open={!!open}
          handleClose={handleClose}
          id={selectedErrorID}
        />
      )}
    </Container>
  );
};

export default AITrainingDetail;
