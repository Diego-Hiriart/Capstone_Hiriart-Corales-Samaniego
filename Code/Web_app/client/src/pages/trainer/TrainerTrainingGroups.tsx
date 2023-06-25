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
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "../../services/axios";
import { TrainingGroup } from "../../types";
import GroupCreateDialog from "../group/GroupCreateDialog";

const TrainerTrainingGroups = () => {
  const [groups, setGroups] = useState<TrainingGroup[]>(null!);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/training_group");
      setGroups(data.data);
    };
    fetchFencers();
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
            Grupos
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Crear grupo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {groups?.map((group) => (
            <ListItem key={group.trainingGroupID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={"groups/" + group.trainingGroupID}
              >
                <ListItemAvatar>
                  <GroupWorkIcon />
                </ListItemAvatar>
                <ListItemText primary={`${group.name}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <GroupCreateDialog open={open} handleClose={handleClose} />
    </Container>
  );
};

export default TrainerTrainingGroups;
