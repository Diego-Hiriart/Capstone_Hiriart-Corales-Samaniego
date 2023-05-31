import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { SingleFeedback } from "../../types";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  handleClose: () => void;
  feedback: SingleFeedback | null;
}

const FeedbackDialog = ({ open, handleClose, feedback }: Props) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Feedback - {dayjs(feedback?.date).format("DD MMMM YYYY")}</DialogTitle>
      <DialogContent>
        <Typography>
          {feedback?.content}
        </Typography>
        <Typography variant="caption">
          {feedback?.trainer?.user?.names} {feedback?.trainer?.user?.lastNames}
        </Typography>
        <DialogActions sx={{ mt: 3 }}>
          <Button fullWidth variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
