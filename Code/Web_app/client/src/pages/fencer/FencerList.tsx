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

const FencerList = () => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);

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
          <Button component={RouterLink} to="create" variant="contained">
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
    </Container>
  );
};

export default FencerList;
