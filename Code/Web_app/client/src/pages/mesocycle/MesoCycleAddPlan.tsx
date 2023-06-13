import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { ActivityType, DailyPlan, MicroCycle } from "../../types";

const schema = z.object({
  name: z.string(),
});

type MesoCycleAddPlanForm = z.infer<typeof schema>;

interface MesoCycleAddPlanProps {
  cycle: MicroCycle;
  handleClose: () => void;
  open: boolean;
  dailyPlan: DailyPlan;
}

const MesoCycleAddPlan = ({
  open,
  handleClose,
  dailyPlan,
}: MesoCycleAddPlanProps) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/activity_type/");
      setActivityTypes(data.data);
    };

    fetchFencers();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MesoCycleAddPlanForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<MesoCycleAddPlanForm> = async (formData) => {
    try {
      const activityType = activityTypes.find(
        (activity) => activity.name === formData.name
      );

      await axios.put("/dashboard/daily_plan/" + dailyPlan.dailyPlanID, {
        data: {
          activityTypeID: activityType?.activityTypeID,
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al crear la actividad del dia",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir plan del día</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Autocomplete
                disablePortal
                id="activityType"
                options={activityTypes
                  ?.filter(
                    (activity) =>
                      dailyPlan?.activityTypeID !== activity.activityTypeID
                  )
                  .map((activity) => activity.name)}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    margin="normal"
                    label="Nombre de la actividad del día"
                    autoFocus
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...params}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Añadir
              </Button>
              <Button fullWidth variant="outlined" onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default MesoCycleAddPlan;
