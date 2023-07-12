import DoneIcon from "@mui/icons-material/Done";
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
import { Link as RouterLink } from "react-router-dom";

import axios from "../../services/axios";
import { Fencer } from "../../types";
import FencerActivate from "./FencerActivate";

const FencerDeactivatedList = () => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [activateOpen, setActivateOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<number>(null!);
  const [selectedUserName, setSelectedUserName] = useState<string>(null!);

  const handleRemoveClose = () => {
    setActivateOpen(false);
  };

  const handleRemoveOpen = (userID: number, userName: string) => {
    setSelectedUserID(userID);
    setSelectedUserName(userName);
    setActivateOpen(true);
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
            Esgrimistas inactivos
          </Typography>
        </Box>
        <List sx={{ mt: 1 }}>
          {fencers?.map((fencer) =>
            !fencer.user.deletedAt ? (
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
                  <DoneIcon />
                </Button>
              </ListItem>
            )
          )}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <FencerActivate
        userID={selectedUserID}
        userName={selectedUserName}
        handleClose={handleRemoveClose}
        open={activateOpen}
      />
    </Container>
  );
};

export default FencerDeactivatedList;
