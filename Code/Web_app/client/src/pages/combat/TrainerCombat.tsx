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
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { TrainingCombatFull } from "../../types";
import TrainerAddCombat from "./TrainerAddCombat";

const TrainerCombat = () => {
  const [combats, setCombats] = useState<TrainingCombatFull[]>(null!);
  const [open, setOpen] = useState(false);
  const [selectedCombat, setSelectedCycle] = useState<TrainingCombatFull>(
    null!
  );
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCombat = async () => {
      const { data } = await axios.get("/dashboard/training_combat/");

      setCombats(data.data);
    };

    fetchCombat();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            Combates
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            + Agregar combate
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {combats?.map((combat) => (
            <ListItem key={combat.trainingCombatID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={String(combat.trainingCombatID)}
              >
                <ListItemText primary={combat.fencer1ID} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <TrainerAddCombat handleClose={handleClose} open={open} />
    </Container>
  );
};

export default TrainerCombat;
