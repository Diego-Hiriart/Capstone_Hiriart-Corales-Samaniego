import { Box, Button, DialogActions, TextField } from "@mui/material";
import { useAlert } from "../../hooks/useAlert";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import axios from "../../services/axios";
import { useParams } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

interface Props {
  handleClose: () => void;
  fetchFeedbacks: () => void;
}

const AddFeedback = ({ handleClose, fetchFeedbacks }: Props) => {
  const { showError, showSuccess } = useAlert();
  const [feedback, setFeedback] = useState("");
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/dashboard/single_feedback`, {
        data: {
          fencerID: id,
          trainerID: user?.trainer?.trainerID,
          date: new Date(),
          content: feedback,
        },
      });
      fetchFeedbacks();
      showSuccess("Feedback creado con éxito");
      handleClose();
    } catch (error) {
      showError("Hubo un error al crear el feedback");
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        multiline
        rows={4}
        label="Retroalimentación"
        id="feedback"
        name="feedback"
        onChange={handleChange}
      />
      <DialogActions sx={{ mt: 3 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddFeedback;
