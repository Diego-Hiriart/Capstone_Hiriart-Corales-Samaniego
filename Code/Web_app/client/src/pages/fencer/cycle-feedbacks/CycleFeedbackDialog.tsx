import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../services/axios";
import { CycleFeedback } from "../../../types";

interface Props {
  open: boolean;
  handleClose: () => void;
  feedback: CycleFeedback;
  fetchFeedbacks: () => void;
}
const CycleFeedbackDialog = ({ open, handleClose, feedback, fetchFeedbacks }: Props) => {
  const [content, setContent] = useState<string>("");
  const { showError, showSuccess } = useAlert();
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      if (!content) {
        showError("El feedback no puede estar vacío");
        return;
      }
      const url = `/dashboard/cycle_feedback/${feedback.cycleFeedbackID}`;
      const body = {
        content: content,
        date: new Date(),
        trainerID: user?.trainer?.trainerID,
      };
      await axios.put(url, { data: body });
      fetchFeedbacks();
      handleClose();
      showSuccess("Feedback guardado");
    } catch (error) {
      console.error(error);
      showError("Hubo un error al guardar el feedback");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleDelete = async () => {
    try {
      const url = `/dashboard/cycle_feedback/${feedback.cycleFeedbackID}`;
      await axios.delete(url);
      fetchFeedbacks();
      handleClose();
      showSuccess("Feedback eliminado");
    } catch (error) {
      console.error(error);
      showError("Hubo un error al eliminar el feedback");
    }
  };

  const isTrainer = user?.roles.includes("trainer");

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="start" gap={3}>
          Feedback para meso-ciclo:{" "}
          {feedback.mesoCycle.name +
            " ( " +
            dayjs(feedback.mesoCycle.startDate).format("DD MMM YYYY") +
            " - " +
            dayjs(feedback.mesoCycle.endDate).format("DD MMM YYYY") +
            " )"}
          {isTrainer && (
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{paddingX: 4}}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            defaultValue={feedback.content}
            onChange={handleChange}
            disabled={!isTrainer}
          />
          <Typography variant="caption"></Typography>
          <Typography variant="caption">
            {dayjs(feedback?.date).format("DD MMMM YYYY")} por{" "}
            {feedback.trainer?.user?.names} {feedback?.trainer?.user?.lastNames}
          </Typography>
          <DialogActions sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cerrar
            </Button>
            {isTrainer && (
              <Button fullWidth variant="contained" onClick={handleSave}>
                Guardar Cambios
              </Button>
            )}
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CycleFeedbackDialog;
