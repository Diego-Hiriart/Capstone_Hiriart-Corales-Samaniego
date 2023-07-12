import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { TrainingCombatFull } from "../../types";
import { CombatEntry } from "./CombatEntry";
import TrainerAddCombat from "./TrainerAddCombat";

const TrainerCombat = () => {
  const [combats, setCombats] = useState<TrainingCombatFull[]>(null!);
  const [open, setOpen] = useState(false);
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
    <Container component="main" maxWidth="lg">
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

          {(user?.roles.includes("trainer") ||
            user?.roles.includes("admin")) && (
            <Button variant="contained" onClick={handleOpen}>
              + Agregar combate
            </Button>
          )}
        </Box>
        <List sx={{ mt: 1 }}>
          {combats?.map((combat) => (
            <ListItem key={combat.trainingCombatID} disablePadding>
              <ListItemButton
                sx={{
                  px: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                component={RouterLink}
                to={String(combat.trainingCombatID)}
              >
                <CombatEntry
                  fencer1Name={`${combat.fencer1.user.names} ${combat.fencer1.user.lastNames}`}
                  fencer2Name={`${combat.fencer2.user.names} ${combat.fencer2.user.lastNames}`}
                  fencer1ID={combat.fencer1ID}
                  fencer2ID={combat.fencer2ID}
                  winnerFencerID={combat.winnerFencerID}
                />
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
