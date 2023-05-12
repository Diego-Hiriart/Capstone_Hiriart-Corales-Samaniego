import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { Link as RouterLink } from "react-router-dom";
import { Trainer } from "../../types";

const TrainerList = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(null!);

  useEffect(() => {
    const fetchTrainers = async () => {
      const { data } = await axios.get("/dashboard/trainer");
      setTrainers(data.data);
    };
    fetchTrainers();
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
            Trainers
          </Typography>
          <Button component={RouterLink} to="create" variant="contained">
            Crear nuevo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {trainers?.map((trainer) => (
            <ListItem key={trainer.trainerID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={String(trainer.trainerID)}
              >
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${trainer.user.names} ${trainer.user.lastNames}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
    </Container>
  );
};

export default TrainerList;
