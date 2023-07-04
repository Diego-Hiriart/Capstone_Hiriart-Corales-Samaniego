import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";

const schema = z.object({
  name: z.string().nonempty("Campo obligatorio"),
  description: z.string().optional(),
});

type TrainingExerciseCreateFormType = z.infer<typeof schema>;

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchTrainingExercises: () => void;
}

const TrainingExerciseCreate = ({
  open,
  handleClose,
  fetchTrainingExercises,
}: Props) => {
  const { showError, showSuccess } = useAlert();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TrainingExerciseCreateFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: TrainingExerciseCreateFormType) => {
    try {
      const url = "/dashboard/training-exercises";
      const data = {
        name: formData.name,
        description: formData.description,
      };
      await axios.post(url, { data: data });
      fetchTrainingExercises();
      showSuccess("Ejercicio de entrenamiento creado con éxito");
      handleClose();
    } catch (error) {
      showError("Hubo un error al crear el ejercicio de entrenamiento");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Ejercicios</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            my={{ xs: 3, sm: 8 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                id="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                multiline
                rows={4}
                label="Descripción"
                id="description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              <Box mt={2}>
                <Button type="submit" variant="outlined">
                  Guardar
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingExerciseCreate;
