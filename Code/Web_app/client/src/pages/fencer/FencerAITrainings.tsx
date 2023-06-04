import {
  Container,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "../../services/axios";
import { AITraining } from "../../types";
import { Link as RouterLink, useParams } from "react-router-dom";
import NewTrainingDialog from "./NewTrainingDialog";
import dayjs from "dayjs";
import AuthContext from "../../contexts/AuthContext";

const FencerAITrainings = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  // const [trainings, setTrainings] = useState<AITraining[]>([]);
  const { id } = useParams();

  const fencerID = user?.roles.includes("fencer") ? user?.fencer?.fencerID : id;
  const aitrainingPath = `/fencer/${fencerID}/aitrainings/`;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // const fetchTrainings = async () => {
    //   const { data } = await axios.get("/dashboard/aitraining");
    //   setTrainings(data.data);
    // };
    // fetchTrainings();
  }, []);

  const trainings = [
    {
      AITraining: 1,
      date: new Date(),
      ejercicio: "Fleche",
      duracion: 5,
    },
  ];

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
            Entrenamientos IA
          </Typography>
          {user?.roles?.includes("fencer") && (
            <Button variant="contained" onClick={handleOpen}>
              Crear nuevo
            </Button>
          )}
        </Box>
        <List sx={{ mt: 1 }}>
          {trainings?.map((training) => (
            <ListItem key={training.AITraining} disablePadding divider>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={aitrainingPath + training.AITraining}
              >
                <ListItemText
                  primary={String(dayjs(training.date).format("DD MMMM YYYY"))}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <NewTrainingDialog open={open} handleClose={handleClose} />
    </Container>
  );
};

export default FencerAITrainings;
