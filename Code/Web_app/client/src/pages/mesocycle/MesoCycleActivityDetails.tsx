import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useContext } from "react";
import { useNavigate } from "react-router";

import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { Activity } from "../../types";

interface MesoCycleActivityDetailsProps {
  activity: Activity;
  handleClose: () => void;
  open: boolean;
  dailyPlanActivityID: number;
}

const MesoCycleActivityDetails = ({
  activity,
  open,
  handleClose,
  dailyPlanActivityID,
}: MesoCycleActivityDetailsProps) => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  function padTo2Digits(num: number) {
    return String(num).padStart(2, "0");
  }

  const removeActivity = async () => {
    try {
      await axios.put(
        "/dashboard/daily_plan_activity/" +
          dailyPlanActivityID +
          "/remove_activity/"
      );
      navigate(0);
    } catch (error) {
      //
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle>Descripción de actividad</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="lg">
          <Box
            width={400}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ marginBottom: 2 }}>
              Actividad: {activity?.name}
            </Typography>
            <Typography sx={{ wordWrap: "break-word", marginBottom: 2 }}>
              Descripción: {activity?.description}
            </Typography>
            <Typography>
              Duración: {new Date(activity?.duration).getMinutes()}:
              {padTo2Digits(new Date(activity?.duration).getSeconds())}
            </Typography>

            {!user?.roles.includes("fencer") && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={removeActivity}
              >
                Eliminar
                <DeleteIcon />
              </Button>
            )}

            <Button fullWidth variant="outlined" onClick={handleClose}>
              Cerrar
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default MesoCycleActivityDetails;
