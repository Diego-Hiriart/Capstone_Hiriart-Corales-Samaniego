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
import { CycleGoal } from "../../../types";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "../../../services/axios";
import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  handleClose: () => void;
  goal: CycleGoal;
  fetchGoals: () => void;
}
const GoalDialog = ({ open, handleClose, goal, fetchGoals }: Props) => {
  const [content, setContent] = useState<string>("");
  const { showError, showSuccess } = useAlert();
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      if (!content) {
        showError("El objetivo no puede estar vacío");
        return;
      }
      const url = `/dashboard/cyclegoal_routes/${goal.cycleGoalID}`;
      const body = {
        content: content,
        date: new Date(),
        trainerID: user?.trainer?.trainerID,
      };
      await axios.put(url, { data: body });
      fetchGoals();
      handleClose();
      showSuccess("Objetivo guardado");
    } catch (error) {
      console.error(error);
      showError("Hubo un error al guardar el objetivo");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleDelete = async () => {
    try {
      const url = `/dashboard/cyclegoal_routes/${goal.cycleGoalID}`;
      await axios.delete(url);
      fetchGoals();
      handleClose();
      showSuccess("Objetivo eliminado");
    } catch (error) {
      console.error(error);
      showError("Hubo un error al eliminar el objetivo");
    }
  };

  const isTrainer = user?.roles.includes("trainer");

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="start" gap={3}>
          Objetivo para meso-ciclo:{" "}
          {goal.mesoCycle.name +
            " ( " +
            dayjs(goal.mesoCycle.startDate).format("DD MMM YYYY") +
            " - " +
            dayjs(goal.mesoCycle.endDate).format("DD MMM YYYY") +
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
            defaultValue={goal.content}
            onChange={handleChange}
            disabled={!isTrainer}
          />
          <Typography variant="caption"></Typography>
          <Typography variant="caption">
            {dayjs(goal?.date).format("DD MMMM YYYY")} por{" "}
            {goal.trainer?.user?.names} {goal?.trainer?.user?.lastNames}
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

export default GoalDialog;
