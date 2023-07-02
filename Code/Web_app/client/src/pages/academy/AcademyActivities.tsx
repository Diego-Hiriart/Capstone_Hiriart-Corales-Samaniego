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
import { Activity } from "../../types";
import ActivityAddType from "./AcademyAddActivity";
import ActivityRemoveType from "./AcademyRemoveActivity";
import AcademyEditActivity from "./AcademyEditActivity";

const AcademyActivities = () => {
  const [activities, setActivities] = useState<Activity[]>(null!);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(null!);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/activity");

      setActivities(data.data);
    };

    fetchGroup();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (activity: Activity) => {
    setSelectedActivity(activity);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
  };

  const handleRemoveOpen = (activity: Activity) => {
    setSelectedActivity(activity);
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
            Actividades
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            + Añadir actividad
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {activities?.map((activity) => (
            <ListItem key={activity.activityID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleEditOpen(activity)}
              >
                <ListItemText primary={activity.name} />
              </ListItemButton>
              <Button variant="text" onClick={() => handleRemoveOpen(activity)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <ActivityAddType handleClose={handleClose} open={open} />
      <AcademyEditActivity
        open={openEdit}
        handleClose={handleEditClose}
        activity={selectedActivity}
      />
      <ActivityRemoveType
        activity={selectedActivity}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default AcademyActivities;
