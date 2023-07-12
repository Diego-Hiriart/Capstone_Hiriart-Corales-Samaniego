import DeleteIcon from "@mui/icons-material/Delete";
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
import { Link as RouterLink } from "react-router-dom";

import axios from "../../services/axios";
import { Fencer } from "../../types";
import FencerDeactivate from "./FencerDeactivate";
import FencerInvite from "./FencerInvite";
import LinkInvite from "./LinkInvite";

const FencerList = () => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<number>(null!);
  const [selectedUserName, setSelectedUserName] = useState<string>(null!);

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
  };

  const handleRemoveOpen = (userID: number, userName: string) => {
    setSelectedUserID(userID);
    setSelectedUserName(userName);
    setRemoveDialogOpen(true);
  };

  const handleOpen = () => {
    setInviteLink("");
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
          {fencers?.map((fencer) =>
            fencer.user.deletedAt ? (
              <></>
            ) : (
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
                <Button
                  variant="text"
                  onClick={() =>
                    handleRemoveOpen(
                      fencer.userID || 0,
                      `${fencer.user.names} ${fencer.user.lastNames}`
                    )
                  }
                >
                  <DeleteIcon />
                </Button>
              </ListItem>
            )
          )}
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
      <FencerDeactivate
        userID={selectedUserID}
        userName={selectedUserName}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default FencerList;
