import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import { MesoCycle, TrainingGroupFull } from "../../types";
import GroupAddFencer from "./GroupAddFencer";
import { formatDate } from "../../utils/formatDate";

const GroupMesoCycle = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupFull>(null!);
  const [open, setOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<MesoCycle>(null!);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/training_group/" + id);

      console.log(data);
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
                to={String(cycle.mesoCycleID)}
              >
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${formatDate(cycle.startDate)} - 
                  ${formatDate(cycle.endDate)}`}
                />
              </ListItemButton>
              <ArrowForwardIosIcon />
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      {/* <GroupAddFencer group={group} handleClose={handleClose} open={open} /> */}
    </Container>
  );
};

export default GroupMesoCycle;
