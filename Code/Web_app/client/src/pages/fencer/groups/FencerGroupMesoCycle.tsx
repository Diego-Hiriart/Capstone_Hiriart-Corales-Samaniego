import {
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "../../../services/axios";
import { TrainingGroupFull } from "../../../types";
import { formatDate } from "../../../utils/formatDate";

const FencerGroupMesoCycle = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<TrainingGroupFull>(null!);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/training_group/" + id);

      setGroup(data.data);
    };

    fetchGroup();
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
            Meso-Ciclo
          </Typography>
        </Box>
        <List sx={{ mt: 1 }}>
          {group?.mesoCycle?.map((cycle) => (
            <ListItem key={cycle.mesoCycleID} disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={`cycles/${cycle.mesoCycleID}`}
              >
                <ListItemText
                  primary={`${formatDate(cycle.startDate)} - 
                  ${formatDate(cycle.endDate)}`}
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

export default FencerGroupMesoCycle;
