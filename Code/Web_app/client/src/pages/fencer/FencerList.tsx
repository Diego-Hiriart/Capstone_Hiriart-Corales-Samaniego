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
import axios from "../../services/axios";
import { Link as RouterLink } from "react-router-dom";
import { Fencer } from "../../types";
import FencerInvite from "./FencerInvite";
import LinkInvite from "./LinkInvite";

const FencerList = () => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const handleOpen = () => {
    setInviteLink("")
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
            Esgrimistas
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
                to={`/fencer/${String(fencer.fencerID)}`}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Esgrimista</DialogTitle>
        <DialogContent>
          {inviteLink ? (
            <LinkInvite inviteLink={inviteLink} handleClose={handleClose} />
          ) : (
            <FencerInvite
              handleClose={handleClose}
              setInviteLink={setInviteLink}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FencerList;
