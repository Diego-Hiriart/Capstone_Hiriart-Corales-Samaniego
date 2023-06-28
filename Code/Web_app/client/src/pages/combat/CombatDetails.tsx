import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { TrainingCombatFull } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { CombatEntry } from "./CombatEntry";
import EditCombat from "./EditCombat";
import DeleteCombat from "./DeleteCombat";

const CombatDetails = () => {
  const [combat, setCombat] = useState<TrainingCombatFull>(null!);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { user } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchCombat = async () => {
      const { data } = await axios.get("/dashboard/training_combat/" + id);

      setCombat(data.data);
    };

    fetchCombat();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const flexEnd = {
    textAlignLast: "end",
    marginRight: 2,
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
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
            mb: 3,
          }}
        >
          <Typography variant="h1" alignSelf="start">
            Detalles del combate
          </Typography>

          {user?.roles.includes("trainer") && (
            <>
              <Button variant="contained" onClick={handleOpen}>
                Editar combate
              </Button>
              <Button variant="text" onClick={handleOpenDelete}>
                <DeleteIcon />
              </Button>
            </>
          )}
        </Box>

        {combat ? (
          <>
            <CombatEntry
              fencer1Name={`${combat?.fencer1.user.names} ${combat?.fencer1.user.lastNames}`}
              fencer2Name={`${combat?.fencer2.user.names} ${combat?.fencer2.user.lastNames}`}
              fencer1ID={combat?.fencer1ID}
              fencer2ID={combat?.fencer2ID}
              winnerFencerID={combat?.winnerFencerID}
            />

            <Grid sx={{ mt: 2 }} container spacing={2} columns={16}>
              <Grid item xs={7}>
                <Box
                  sx={{
                    px: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6">Lado izquierdo</Typography>
                  <Typography>Puntaje</Typography>
                  <Typography>{combat.fencer1Score}</Typography>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <Box
                  sx={{
                    px: 1,
                    display: "flex",
                    justifyContent: "end",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" sx={flexEnd}>
                    Lado derecho
                  </Typography>
                  <Typography sx={flexEnd}>Puntaje</Typography>
                  <Typography sx={flexEnd}>{combat.fencer2Score}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, px: 1 }}>
              <Typography variant="h6">Fecha</Typography>
              <Typography variant="h6">
                {formatDate(new Date(combat.dateTime))}
              </Typography>
            </Box>
          </>
        ) : (
          "Loading..."
        )}

        {/* TODO: Add pagination */}
      </Box>
      <EditCombat open={open} handleClose={handleClose} combat={combat} />
      <DeleteCombat
        open={openDelete}
        handleClose={handleCloseDelete}
        id={Number(id)}
      />
    </Container>
  );
};

export default CombatDetails;
