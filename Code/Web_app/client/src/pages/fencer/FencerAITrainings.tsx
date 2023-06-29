import {
  Container,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { AITraining } from "../../types";
import { Link as RouterLink } from "react-router-dom";
import NewTrainingDialog from "./NewTrainingDialog";
import dayjs from "dayjs";
import useAuth from "../../hooks/useAuth";

const FencerAITrainings = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<AITraining[]>([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      const { data } = await axios.get("/dashboard/aitraining");
      setTrainings(data.data);
    };
    fetchTrainings();
  }, []);

  const detailUrl = (id: number) => {
    if (!user?.roles?.includes("fencer")) {
      return `/fencer/aitraining/${id}`;
    }
    return String(id);
  }

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