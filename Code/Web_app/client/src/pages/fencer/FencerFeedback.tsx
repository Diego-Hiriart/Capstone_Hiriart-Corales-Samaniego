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
import { SingleFeedback } from "../../types";
import axios from "../../services/axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Link as RouterLink } from "react-router-dom";

const FencerFeedback = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<SingleFeedback[]>([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data } = await axios.get(
        `/dashboard/fencer_single_feedback/${id}`
      );
      setFeedbacks(data.data);
    };
    fetchFeedbacks();
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ flexGrow: 1 }} variant="h1">
            Feedback
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Crear nuevo
          </Button>
        </Box>
        <List>
          {feedbacks?.map((feedback) => (
            <ListItem key={feedback.singleFeedbackID} alignItems="flex-start" divider disablePadding>
              <ListItemButton
                sx={{ px: 1 }}
                component={RouterLink}
                to={String(feedback.singleFeedbackID)}
              >
                <ListItemText
                  primary={dayjs(feedback.date).format("DD MMMM YYYY")}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {feedback.content}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: add pagination */}
      </Box>
    </Container>
  );
};

export default FencerFeedback;
