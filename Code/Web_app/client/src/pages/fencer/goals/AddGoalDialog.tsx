import { zodResolver } from "@hookform/resolvers/zod";
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
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../services/axios";
import { MesoCycle } from "../../../types";

const schema = z.object({
  content: z.string().nonempty("Campo obligatorio"),
  mesoCycle: z.union([
    z.string().nonempty("Campo obligatorio"),
    z.number().positive("Campo obligatorio"),
  ]),
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
    handleSubmit,
    register,
    setError,
  } = useForm<AddGoalDialogType>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      mesoCycle: "",
    },
  });

  useEffect(() => {
    const fetchMesoCycles = async () => {
      const fencerId = id ? id : user?.fencer?.fencerID;
      const url = `/dashboard/group/meso_cycle/${fencerId}`;
      const { data } = await axios.get(url);
      setMesoCycles(data.data);
      if (data.data.length <= 0) {
        setError("mesoCycle", {
          message: "No hay mesociclos disponibles",
        });
      }
    };
    fetchMesoCycles().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los mesociclos");
      handleClose();
    });
  }, []);

  const onSubmit: SubmitHandler<AddGoalDialogType> = async (formData) => {
    try {
      const url = "/dashboard/cyclegoal_routes/";
      const body = {
        fencerID: Number(id),
        trainerID: user?.trainer?.trainerID,
        mesoCycleID: Number(formData.mesoCycle),
        date: new Date(),
        content: formData.content,
      };
      await axios.post(url, { data: body });
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
            <InputLabel id="mesocycle-label">Meso-ciclo</InputLabel>
            <Controller
              name="mesoCycle"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="mesocycle-label" label="Meso-ciclo">
                  {mesoCycles.map((mesoCycle) => (
                    <MenuItem
                      key={mesoCycle.mesoCycleID}
                      value={mesoCycle.mesoCycleID}
                    >
                      {mesoCycle.name} ({" "}
                      {dayjs(mesoCycle.startDate).format("DD MMM YYYY")} -{" "}
                      {dayjs(mesoCycle.endDate).format("DD MMM YYYY")} )
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
            id="content"
            {...register("content")}
            error={!!errors.content}
            helperText={errors.content?.message}
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
