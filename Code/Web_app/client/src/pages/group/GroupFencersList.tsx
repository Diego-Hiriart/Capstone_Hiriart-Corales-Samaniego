import DeleteIcon from "@mui/icons-material/Delete";
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
import { Link as RouterLink, useParams } from "react-router-dom";

import axios from "../../services/axios";
import { Fencer, TrainingGroupFull } from "../../types";
import GroupAddFencer from "./GroupAddFencer";
import GroupRemoveFencer from "./GroupRemoveFencer";

const GroupFencersList = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupFull>(null!);
  const [open, setOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedFencer, setSelectedFencer] = useState<Fencer>(null!);

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

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
  };

  const handleRemoveOpen = (fencer: Fencer) => {
    setSelectedFencer(fencer);
    setRemoveDialogOpen(true);
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
            Integrantes
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            + Añadir integrante
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {group?.fencer.map((fencer) => (
            <ListItem key={fencer.fencerID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={`/fencer/${fencer.fencerID}`}
              >
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${fencer.user.names} ${fencer.user.lastNames}`}
                />
              </ListItemButton>
              <Button variant="text" onClick={() => handleRemoveOpen(fencer)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <GroupAddFencer group={group} handleClose={handleClose} open={open} />
      <GroupRemoveFencer
        group={group}
        fencer={selectedFencer}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default GroupFencersList;
