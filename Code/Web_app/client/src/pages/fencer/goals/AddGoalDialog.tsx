import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../../../services/axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MesoCycle } from "../../../types";

const schema = z.object({
  goal: z.string().nonempty("Campo obligatorio"),
  mesoCycle: z.number().positive("Campo obligatorio"),
});

type AddGoalDialogType = z.infer<typeof schema>;

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchGoals: () => void;
}

const AddGoalDialog = ({ open, handleClose, fetchGoals }: Props) => {
  const { showError, showSuccess } = useAlert();
  const [mesoCycles, setMesoCycles] = useState<MesoCycle[]>([]);
  const { user } = useAuth();
  const { id } = useParams();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<AddGoalDialogType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchMesoCycles = async () => {
      const url = "/dashboard/mesocycle_routes/";
      const { data } = await axios.get(url);
      setMesoCycles(data.data);
    };
    fetchMesoCycles().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los mesociclos");
      handleClose();
    });
  }, []);

  const onSubmit: SubmitHandler<AddGoalDialogType> = async (formData) => {
    try {
      await axios.post(`/dashboard/cyclegoal_routes/`, {
        data: {
          fencerID: id,
          trainerID: user?.trainer?.trainerID,
          mesoCycleID: formData.mesoCycle, // TODO
          date: new Date(),
          content: formData.goal,
        },
      });
      fetchGoals();
      showSuccess("Feedback creado con éxito");
      handleClose();
    } catch (error) {
      console.error(error);
      showError("Hubo un error al crear el feedback");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Agregar Objetivo</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal" error={!!errors.mesoCycle}>
            <InputLabel id="mesocycle-label">Ejercicio</InputLabel>
            <Controller
              name="mesoCycle"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="mesocycle-label" label="Ejercicio">
                  {mesoCycles.map((mesoCycle) => (
                    <MenuItem
                      key={mesoCycle.mesoCycleID}
                      value={mesoCycle.mesoCycleID}
                    >
                      {mesoCycle.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.mesoCycle?.message}</FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Objetivo"
            id="goal"
            {...register("goal")}
            error={!!errors.goal}
            helperText={errors.goal?.message}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
