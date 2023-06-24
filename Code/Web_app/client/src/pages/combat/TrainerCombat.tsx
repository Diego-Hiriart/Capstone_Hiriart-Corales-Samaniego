import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

  const WinnerIcon = () => (
    <Typography
      sx={{
        backgroundColor: "gray",
        color: "white",
        padding: "8px",
        borderRadius: "0.2rem",
      }}
    >
      GANADOR
    </Typography>
  );

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
          <Button variant="contained" onClick={handleOpen}>
            + Agregar combate
          </Button>
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
                <Grid container spacing={2} columns={16}>
                  <Grid item xs={7}>
                    <Box
                      sx={{
                        px: 1,
                        display: "flex",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${combat.fencer1.user.names} ${combat.fencer2.user.lastNames}`}
                      />
                      {combat.winnerFencerID === combat.fencer1.fencerID && (
                        <WinnerIcon />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Typography sx={{ marginX: "4px" }}>VS</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box
                      sx={{
                        px: 1,
                        display: "flex",
                      }}
                    >
                      {combat.winnerFencerID === combat.fencer2.fencerID && (
                        <WinnerIcon />
                      )}
                      <ListItemText
                        sx={{ textAlignLast: "end", marginRight: 2 }}
                        primary={`${combat.fencer2.user.names} ${combat.fencer2.user.lastNames}`}
                      />
                      <ListItemAvatar>
                        <Avatar></Avatar>
                      </ListItemAvatar>
                    </Box>
                  </Grid>
                </Grid>
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
