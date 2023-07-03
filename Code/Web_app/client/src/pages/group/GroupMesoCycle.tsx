import DeleteIcon from "@mui/icons-material/Delete";
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
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { MesoCycle, TrainingGroupFull } from "../../types";
import { formatDate } from "../../utils/formatDate";
import DeleteMesoCycle from "./DeleteMesoCycle";
import GroupAddMesocycle from "./GroupAddMesocycle";

const GroupMesoCycle = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupFull>(null!);
  const [open, setOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<MesoCycle>(null!);
  const [openEdit, setOpenEdit] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/training_group/" + id);

      setGroup(data.data);
    };

    fetchGroup();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEdit = (cycle: MesoCycle) => {
    setSelectedCycle(cycle);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
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
            Meso-Ciclo
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            + Agregar meso-ciclo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {group?.mesoCycle?.map((cycle) => (
            <ListItem key={cycle.mesoCycleID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={`cycles/${cycle.mesoCycleID}`}
              >
                <ListItemText
                  primary={`${formatDate(cycle.startDate)} - 
                  ${formatDate(cycle.endDate)}`}
                />
              </ListItemButton>
              <Button variant="text" onClick={() => handleOpenEdit(cycle)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <GroupAddMesocycle
        group={group}
        handleClose={handleClose}
        open={open}
        trainerID={user?.trainer?.trainerID ?? 1}
      />
      <DeleteMesoCycle
        cycle={selectedCycle}
        handleClose={handleCloseEdit}
        open={openEdit}
      />
    </Container>
  );
};

export default GroupMesoCycle;
