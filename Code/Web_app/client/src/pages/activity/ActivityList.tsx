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
import { useEffect, useState } from "react";

import axios from "../../services/axios";
import { ActivityType } from "../../types";
import ActivityAddType from "./ActivityAddType";
import ActivityRemoveType from "./ActivityRemoveType";

const ActivityList = () => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(null!);
  const [open, setOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null!);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/activity_type");

      setActivityTypes(data.data);
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

  const handleRemoveOpen = (activityType: ActivityType) => {
    setSelectedActivity(activityType);
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
            Tipos de actividades
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            + Añadir tipo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {activityTypes?.map((type) => (
            <ListItem key={type.activityTypeID} disablePadding>
              <ListItemButton sx={{ px: 1 }}>
                <ListItemText primary={type.name} />
              </ListItemButton>
              <Button variant="text" onClick={() => handleRemoveOpen(type)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <ActivityAddType handleClose={handleClose} open={open} />
      <ActivityRemoveType
        activityType={selectedActivity}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default ActivityList;
