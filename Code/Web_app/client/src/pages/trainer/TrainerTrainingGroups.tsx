import DeleteIcon from "@mui/icons-material/Delete";
import {
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
import { TrainingGroup, TrainingGroupFull } from "../../types";
import GroupCreateDialog from "../group/GroupCreateDialog";
import GroupRemove from "../group/GroupRemove";

const TrainerTrainingGroups = () => {
  const [groups, setGroups] = useState<TrainingGroup[]>(null!);
  const [open, setOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedGroupID, setSelectedGroupID] = useState<number>(null!);
  const [selectedGroupName, setSelectedGroupName] = useState<string>(null!);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
  };

  const handleRemoveOpen = (groupID: number, groupName: string) => {
    setSelectedGroupID(groupID);
    setSelectedGroupName(groupName);
    setRemoveDialogOpen(true);
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
              <Button
                variant="text"
                onClick={() =>
                  handleRemoveOpen(group.trainingGroupID, group.name)
                }
              >
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <GroupCreateDialog open={open} handleClose={handleClose} />
      <GroupRemove
        groupID={selectedGroupID}
        groupName={selectedGroupName}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default TrainerTrainingGroups;
