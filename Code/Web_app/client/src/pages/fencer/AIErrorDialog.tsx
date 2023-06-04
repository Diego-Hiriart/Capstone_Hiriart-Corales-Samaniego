import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { TrainingError } from "../../types";
import axios from "../../services/axios";

interface Props {
  open: boolean;
  handleClose: () => void;
  id: number;
}

const AIErrorDialog = ({ open, handleClose, id }: Props) => {
  // const [error, setError] = useState<TrainingError | null>(null);

  useEffect(() => {
    // const fetchError = async () => {
    //   const { data } = await axios.get(`/dashboard/error/${id}`);
    //   setError(data.data);
    // }
    // fetchError();
  });

  const error = {
    id: 1,
    title: "Posición incorrecta",
    description: "El esgrimista no se encuentra en la posición correcta",
    // correctPose:
    // incorrectPose:
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{error.title}</DialogTitle>
      <DialogContent>
        <Typography>{error.description}</Typography>
        <DialogActions sx={{ mt: 3 }}>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AIErrorDialog;
