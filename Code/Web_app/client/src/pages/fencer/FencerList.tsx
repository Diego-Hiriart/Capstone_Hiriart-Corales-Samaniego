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
import axios from "../../services/axios";
import { Link as RouterLink } from "react-router-dom";
import { Fencer } from "../../types";
import FencerCreateDialog from "./FencerCreateDialog";

const FencerList = () => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/fencer");
      setFencers(data.data);
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
            Fencers
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Crear nuevo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {fencers?.map((fencer) => (
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
      <FencerCreateDialog open={open} handleClose={handleClose} />
    </Container>
  );
};

export default FencerList;
