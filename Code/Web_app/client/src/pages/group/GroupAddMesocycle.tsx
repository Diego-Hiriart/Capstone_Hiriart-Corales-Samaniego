import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { TrainingGroupFull } from "../../types";

const schema = z.object({
  name: z.string(),
  period: z.string(),
  stage: z.string(),
});

type GroupAddMesocycleForm = z.infer<typeof schema>;

interface GroupAddMesocycleProps {
  group: TrainingGroupFull;
  handleClose: () => void;
  open: boolean;
  trainerID: number;
}

const GroupAddMesocycle = ({
  open,
  handleClose,
  group,
  trainerID,
}: GroupAddMesocycleProps) => {
  const [startDate, setStartDate] = useState<Date>(null!);
  const [endDate, setEndDate] = useState<Date>(null!);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GroupAddMesocycleForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<GroupAddMesocycleForm> = async (formData) => {
    try {
      await axios.post("/dashboard/meso_cycle/", {
        data: {
          trainingGroupID: group.trainingGroupID,
          trainerID: trainerID,
          name: formData.name,
          startDate: startDate,
          endDate: endDate,
          period: formData.period,
          stage: formData.stage,
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al crear ciclo",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear meso-ciclo</DialogTitle>
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
              <TextField
                required
                fullWidth
                margin="normal"
                id="name"
                label="Nombre del ciclo"
                autoFocus
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <FormControl>
                <FormLabel>Fecha Inicial</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(newValue: Date | null) => {
                      setStartDate(newValue ?? new Date());
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl>
                <FormLabel>Fecha Final</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(newValue: Date | null) => {
                      setEndDate(newValue ?? new Date());
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              <TextField
                required
                fullWidth
                margin="normal"
                id="period"
                label="Periodo"
                autoFocus
                {...register("period")}
                error={!!errors.period}
                helperText={errors.period?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="stage"
                label="Fase"
                autoFocus
                {...register("stage")}
                error={!!errors.stage}
                helperText={errors.stage?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Crear
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

export default GroupAddMesocycle;
