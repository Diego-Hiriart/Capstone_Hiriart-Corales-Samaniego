import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { AITraining, Move, PoseAnalisisData, TrainingError } from "../../types";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import AIErrorDialog from "./AIErrorDialog";
import useAuth from "../../hooks/useAuth";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAlert } from "../../hooks/useAlert";
import { poseAnalisisResponseMock } from "./poseErrorMock";

const schema = z.object({
  feedback: z.string().trim().max(255).nullish(),
});

type FormType = z.infer<typeof schema>;

const AITrainingDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [poseAnalisisData, setPoseAnalisisData] =
    useState<PoseAnalisisData | null>(null);
  const [training, setTraining] = useState<AITraining | null>(null);
  const aitrainingURL = `/dashboard/aitraining/${id}`;
  const { showSuccess, showError } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchTraining = async () => {
      const { data } = await axios.get(`/dashboard/aitraining/${id}`);
      setTraining(data.data);
    };
    fetchTraining();
  }, []);

  useEffect(() => {
    reset({ feedback: training?.feedback });
  }, [training]);

  const handleClose = () => {
    setErrorDialogOpen(false);
  };

  const handleOpen = async (id: number) => {
    // Testing (remove eventually)
    // setPoseAnalisisData(poseAnalisisResponseMock.data);

    try {
      const { data } = await axios.get(`/dashboard/training_error/${id}`);
      const trainingError = data.data as TrainingError;

      const dialogData: PoseAnalisisData = {
        incorrectMove: JSON.parse(trainingError.poseData) as Move,
        correctMove: JSON.parse(trainingError.error.correctPose) as Move,
        title: trainingError.error.name,
        description: trainingError.error.description,
      };
      setPoseAnalisisData(dialogData);
      setErrorDialogOpen(true);
    } catch (error) {
      console.error(error);
      showError("Error al obtener datos de error");
    }
  };

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    try {
      await axios.put(aitrainingURL, { data: formData });
      showSuccess("Feedback guardado");
      reset({}, { keepValues: true });
    } catch (error) {
      console.error(error);
      showError("Error al guardar feedback");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Typography variant="h1">
          Entrenamiento {training?.AITrainingID}
        </Typography>
        <Typography>
          Fecha: {String(dayjs(training?.date).format("DD/MM/YYYY"))}
        </Typography>
        <Typography variant="h5" mt={5}>
          Errores
        </Typography>
        <List>
          {training?.trainingError.map((te) => (
            <ListItem key={te.trainingErrorID} disablePadding divider>
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleOpen(te.trainingErrorID)}
              >
                <ListItemText primary={te.error.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: add pagination */}
        <Typography variant="h5" mt={5}>
          Feedback
        </Typography>
        {user?.roles?.includes("trainer") ? (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              multiline
              rows={4}
              {...register("feedback")}
              id="feedback"
              error={!!errors?.feedback}
              helperText={errors.feedback?.message}
            />
            <Button type="submit" variant="contained" disabled={!isDirty}>
              Guardar feedback
            </Button>
          </Box>
        ) : (
          <Typography>{training?.feedback}</Typography>
        )}
      </Box>
      {poseAnalisisData && (
        <AIErrorDialog
          open={errorDialogOpen}
          handleClose={handleClose}
          poseAnalisisData={poseAnalisisData}
        />
      )}
    </Container>
  );
};

export default AITrainingDetail;
