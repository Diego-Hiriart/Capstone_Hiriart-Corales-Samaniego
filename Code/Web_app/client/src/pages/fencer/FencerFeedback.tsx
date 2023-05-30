import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { Link as RouterLink } from "react-router-dom";
import AddFeedback from "./AddFeedback";
import AuthContext from "../../contexts/AuthContext";

const FencerFeedback = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<SingleFeedback[]>([]);
  const { user } = useContext(AuthContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            <Button variant="contained" onClick={handleOpen}>
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
              <ListItemButton
                sx={{ px: 1 }}
                // component={RouterLink}
                // to={String(feedback.singleFeedbackID)}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Feedback</DialogTitle>
        <DialogContent>
          <AddFeedback
            handleClose={handleClose}
            fetchFeedbacks={fetchFeedbacks}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FencerFeedback;
function showError(arg0: string) {
  throw new Error("Function not implemented.");
}
