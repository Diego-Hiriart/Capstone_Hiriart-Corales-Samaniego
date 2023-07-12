import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useAlert } from "../../hooks/useAlert";
import useAuth from "../../hooks/useAuth";
import axios from "../../services/axios";
import { AITraining } from "../../types";
import NewTrainingDialog from "./NewTrainingDialog";

const FencerAITrainings = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<AITraining[]>([]);
  const { id } = useParams();
  const { showError } = useAlert();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      const fencerID = id ? id : user?.fencer?.fencerID;
      const url = `/dashboard/fencer/aitraining/${fencerID}`;
      const { data } = await axios.get(url);
      setTrainings(data.data);
    };
    fetchTrainings().catch((error) => {
      showError("Error al cargar los entrenamientos");
    });
  }, []);

  const detailUrl = (id: number) => {
    if (!user?.roles?.includes("fencer")) {
      return `/fencer/aitraining/${id}`;
    }
    return String(id);
  };

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
            <ListItem key={training.AITrainingID} disablePadding divider>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={detailUrl(training.AITrainingID)}
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
