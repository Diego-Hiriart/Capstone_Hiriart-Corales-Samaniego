import {
  Avatar,
  Box,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "../../../services/axios";
import { TrainingGroupFull } from "../../../types";

const FencerGroupList = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupFull>(null!);

  useEffect(() => {
    const fetchGroup = async () => {
      if (id === "0") return;

      const { data } = await axios.get("/dashboard/training_group/" + id);

      setGroup(data.data);
    };

    fetchGroup();
  }, []);

  return id !== "0" ? (
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
        </Box>
        <List sx={{ mt: 1 }}>
          {group?.fencer.map((fencer) => (
            <ListItem key={fencer.fencerID} disablePadding>
              <ListItem sx={{ px: 1 }}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${fencer.user.names} ${fencer.user.lastNames}`}
                />
              </ListItem>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
    </Container>
  ) : (
    <Typography variant="h1" alignSelf="start">
      No perteneces a ningun grupo
    </Typography>
  );
};

export default FencerGroupList;
