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
import { useCallback, useContext, useEffect, useState } from "react";
import { SingleFeedback } from "../../types";
import axios from "../../services/axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import AddFeedbackDialog from "./AddFeedbackDialog";
import AuthContext from "../../contexts/AuthContext";
import { useAlert } from "../../hooks/useAlert";
import FeedbackDialog from "./FeedbackDialog";

const FencerFeedback = () => {
  const { id } = useParams();
  const [showAddFeedbackDialog, setShowAddFeedbackDialog] = useState(false);
  const [feedbacks, setFeedbacks] = useState<SingleFeedback[]>([]);
  const { user } = useContext(AuthContext);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const { showError } = useAlert();
  const [selectedFeedback, setSelectedFeedback] = useState<SingleFeedback | null>(null);

  const handleAddFeedbackDialogOpen = () => {
    setShowAddFeedbackDialog(true);
  };
  const handleFeedbackDialogOpen = (feedback: SingleFeedback | null) => {
    setShowFeedbackDialog(true);
    setSelectedFeedback(feedback)
  };

  const handleClose = () => {
    setShowAddFeedbackDialog(false);
    setShowFeedbackDialog(false);
  };

  const fetchFeedbacks = useCallback(async () => {
    const { data } = await axios.get(`/dashboard/fencer_single_feedback/${id}`);
    setFeedbacks(data.data);
  }, []);

  useEffect(() => {
    fetchFeedbacks().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los feedbacks");
    });
  }, [fetchFeedbacks]);

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
          {user?.roles.includes("trainer") && (
            <Button variant="contained" onClick={handleAddFeedbackDialogOpen}>
              Crear nuevo
            </Button>
          )}
        </Box>
        <List>
          {feedbacks?.map((feedback) => (
            <ListItem
              key={feedback.singleFeedbackID}
              alignItems="flex-start"
              divider
              disablePadding
            >
              <ListItemButton sx={{ px: 1 }} onClick={() => handleFeedbackDialogOpen(feedback)}>
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
      <AddFeedbackDialog
        open={showAddFeedbackDialog}
        handleClose={handleClose}
        fetchFeedbacks={fetchFeedbacks}
      />
      <FeedbackDialog open={showFeedbackDialog} handleClose={handleClose} feedback={selectedFeedback}/>
    </Container>
  );
};

export default FencerFeedback;