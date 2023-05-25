import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { Fencer, TrainingGroup } from "../../types";
import GroupAddFencer from "./GroupAddFencer";

interface TrainingGroupWithFencers extends TrainingGroup {
  fencer: Fencer[];
}

const GroupFencersList = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupWithFencers>(null!);
  const [open, setOpen] = useState(false);

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
                to={String(fencer.fencerID)}
              >
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${fencer.user.names} ${fencer.user.lastNames}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <GroupAddFencer
        groupID={Number(id)}
        handleClose={handleClose}
        open={open}
      />
    </Container>
  );
};

export default GroupFencersList;
