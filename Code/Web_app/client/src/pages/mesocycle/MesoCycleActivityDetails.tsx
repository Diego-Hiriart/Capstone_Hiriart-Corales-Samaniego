import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { Activity, ActivityType, DailyPlan } from "../../types";

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
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/activity_type/");
      setActivityTypes(data.data);
    };

    fetchFencers();
  }, []);

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
