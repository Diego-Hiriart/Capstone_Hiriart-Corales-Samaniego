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
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../services/axios";
import { CycleFeedback } from "../../../types";
import AddCycleFeedbackDialog from "./AddCycleFeedbackDialog";
import CycleFeedbackDialog from "./CycleFeedbackDialog";

const CycleFeedbacks = () => {
  const { user } = useAuth();
  const [showAddFeedbackDialog, setShowAddFeedbackDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<CycleFeedback>();
  const [feedbacks, setFeedbacks] = useState<CycleFeedback[]>();
  const { id } = useParams();
  const { showError } = useAlert();

  const handleFeedbackDialogOpen = (feedback: CycleFeedback) => {
    setShowAddFeedbackDialog(true);
    setSelectedFeedback(feedback);
  };

  const handleAddFeedbackDialogOpen = () => {
    setShowAddFeedbackDialog(true);
  };

  const handleClose = () => {
    setShowAddFeedbackDialog(false);
    setShowAddFeedbackDialog(false);
  };

  const fetchFeedbacks = useCallback(async () => {
    const fencerId = id ? id : user?.fencer?.fencerID;
    const url = `/dashboard/fencer/cyclegoal_routes/${fencerId}`;
    const { data } = await axios.get(url);
    setFeedbacks(data.data);
  }, [id]);

  useEffect(() => {
    fetchFeedbacks().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los feedbacks");
    });
  }, [fetchFeedbacks]);

  const isTrainer = user?.roles.includes("trainer");

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
            Feedbacks de mesociclo
          </Typography>
          {isTrainer && (
            <Button variant="contained" onClick={handleAddFeedbackDialogOpen}>
              Crear nuevo
            </Button>
          )}
        </Box>
        <List>
          {feedbacks?.map((feedback) => (
            <ListItem
              key={feedback.cycleFeedbackID}
              alignItems="flex-start"
              divider
              disablePadding
            >
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleFeedbackDialogOpen(feedback)}
              >
                <ListItemText
                  primary={
                    feedback.mesoCycle.name +
                    " ( " +
                    dayjs(feedback.mesoCycle.startDate).format("DD MMM YYYY") +
                    " - " +
                    dayjs(feedback.mesoCycle.endDate).format("DD MMM YYYY") +
                    " )"
                  }
                  secondary={
                    <Typography noWrap variant="body2" color="text.primary">
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
      {showAddFeedbackDialog && (
        <AddCycleFeedbackDialog
          open={showAddFeedbackDialog}
          handleClose={handleClose}
          fetchFeedbacks={fetchFeedbacks}
        />
      )}
      {showFeedbackDialog && selectedFeedback && (
        <CycleFeedbackDialog
          open={showFeedbackDialog}
          handleClose={handleClose}
          feedback={selectedFeedback}
          fetchFeedbacks={fetchFeedbacks}
        />
      )}
    </Container>
  );
};

export default FencerFeedbacks;
