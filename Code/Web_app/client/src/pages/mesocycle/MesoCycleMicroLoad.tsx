import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  FormLabel,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { MicroCycle } from "../../types";

const min = 0;
const max = 5;

const schema = z.object({
  // Physical
  speed: z.string(),
  coordination: z.string(),
  resistance: z.string(),
  strength: z.string(),
  // Technical
  individualLessons: z.string(),
  groupLessons: z.string(),
  pairWork: z.string(),
  individualWork: z.string(),
  technicalBasedCombats: z.string(),
  // Tactical
  trainingTournament: z.string(),
  freeCombat: z.string(),
  tacticalIndividualLesson: z.string(),
  competitionAnalysis: z.string(),
});

type MesoCycleMicroLoadForm = z.infer<typeof schema>;

interface MesoCycleMicroLoadProps {
  cycle: MicroCycle;
  handleClose: () => void;
  open: boolean;
}

const MesoCycleMicroLoad = ({
  open,
  handleClose,
  cycle,
}: MesoCycleMicroLoadProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<MesoCycleMicroLoadForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cycle) {
      reset({
        speed: cycle.speed?.toString(),
        coordination: cycle.coordination?.toString(),
        resistance: cycle.resistance?.toString(),
        strength: cycle.strength?.toString(),
        individualLessons: cycle.individualLessons?.toString(),
        groupLessons: cycle.groupLessons?.toString(),
        pairWork: cycle.pairWork?.toString(),
        individualWork: cycle.individualWork?.toString(),
        technicalBasedCombats: cycle.technicalBasedCombats?.toString(),
        trainingTournament: cycle.trainingTournament?.toString(),
        freeCombat: cycle.freeCombat?.toString(),
        tacticalIndividualLesson: cycle.tacticalIndividualLesson?.toString(),
        competitionAnalysis: cycle.competitionAnalysis?.toString(),
      });
    }
  }, [cycle]);

  const onSubmit: SubmitHandler<MesoCycleMicroLoadForm> = async (formData) => {
    try {
      await axios.put("/dashboard/micro_cycle/" + cycle.microCycleID, {
        data: {
          speed: Number(formData.speed),
          coordination: Number(formData.coordination),
          resistance: Number(formData.resistance),
          strength: Number(formData.strength),
          individualLessons: Number(formData.individualLessons),
          groupLessons: Number(formData.groupLessons),
          pairWork: Number(formData.pairWork),
          individualWork: Number(formData.individualLessons),
          technicalBasedCombats: Number(formData.technicalBasedCombats),
          trainingTournament: Number(formData.trainingTournament),
          freeCombat: Number(formData.freeCombat),
          tacticalIndividualLesson: Number(formData.tacticalIndividualLesson),
          competitionAnalysis: Number(formData.competitionAnalysis),
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
              <FormLabel>Puntaje físico</FormLabel>
              <TextField
                required
                fullWidth
                margin="normal"
                id="speed"
                label="Velocidad"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.speed}
                {...register("speed")}
                error={!errors.speed}
                helperText={errors.speed?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="coordination"
                label="Coordinación"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.coordination}
                {...register("coordination")}
                error={!errors.coordination}
                helperText={errors.coordination?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="resistance"
                label="Resistencia"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.resistance}
                {...register("resistance")}
                error={!errors.resistance}
                helperText={errors.resistance?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="strength"
                label="Fuerza"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.strength}
                {...register("strength")}
                error={!errors.strength}
                helperText={errors.strength?.message}
              />

              <FormLabel>Puntaje técnico</FormLabel>
              <TextField
                required
                fullWidth
                margin="normal"
                id="individualLessons"
                label="Lecciones individuales"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.individualLessons}
                {...register("individualLessons")}
                error={!errors.individualLessons}
                helperText={errors.individualLessons?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="groupLessons"
                label="Lecciones grupales"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.groupLessons}
                {...register("groupLessons")}
                error={!errors.groupLessons}
                helperText={errors.groupLessons?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="pairWork"
                label="Trabajo en pareja"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.pairWork}
                {...register("pairWork")}
                error={!errors.pairWork}
                helperText={errors.pairWork?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="individualWork"
                label="Trabajo individual"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.individualWork}
                {...register("individualWork")}
                error={!errors.individualWork}
                helperText={errors.individualWork?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="technicalBasedCombats"
                label="Combates con fundamentos técnicos"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.technicalBasedCombats}
                {...register("technicalBasedCombats")}
                error={!errors.technicalBasedCombats}
                helperText={errors.technicalBasedCombats?.message}
              />

              <FormLabel>Puntaje táctico</FormLabel>
              <TextField
                required
                fullWidth
                margin="normal"
                id="trainingTournament"
                label="Torneo de entrenamiento"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.trainingTournament}
                {...register("trainingTournament")}
                error={!errors.trainingTournament}
                helperText={errors.trainingTournament?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="freeCombat"
                label="Combate libre"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.freeCombat}
                {...register("freeCombat")}
                error={!errors.freeCombat}
                helperText={errors.freeCombat?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="tacticalIndividualLesson"
                label="Lección individual táctica"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.tacticalIndividualLesson}
                {...register("tacticalIndividualLesson")}
                error={!errors.tacticalIndividualLesson}
                helperText={errors.tacticalIndividualLesson?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="competitionAnalysis"
                label="Análisis de la competencia"
                type="number"
                InputProps={{ inputProps: { min: min, max: max } }}
                defaultValue={cycle?.competitionAnalysis}
                {...register("competitionAnalysis")}
                error={!errors.competitionAnalysis}
                helperText={errors.competitionAnalysis?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Cambiar
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

export default MesoCycleMicroLoad;
