import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fileToString } from "../../utils/files";
import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";

const schema = z.object({
  name: z.string().nonempty("Campo obligatorio"),
  systemName: z.string().nonempty("Campo obligatorio"),
  description: z.string().nonempty("Campo obligatorio"),
  correctPose: z
    .instanceof(FileList)
    .optional()
    .refine(
      async (fileList) => {
        return fileList?.length
          ? fileList[0].type === "application/json"
          : false;
      },
      { message: "Archivo no valido" }
    )
    .transform(async (fileList) => {
      if (fileList?.[0]) {
        return await fileToString(fileList?.[0]);
      }
    }),
});

type MoveErrorCreateFormType = z.infer<typeof schema>;

interface Props {
  open: boolean;
  handleClose: () => void;
  fetchMoveErrors: () => void;
}

const MoveErrorCreate = ({ open, handleClose, fetchMoveErrors }: Props) => {
  const { showError, showSuccess } = useAlert();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MoveErrorCreateFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: MoveErrorCreateFormType) => {
    try {
      const url = "/dashboard/error";
      const data = {
        name: formData.name,
        systemName: formData.systemName,
        description: formData.description,
        correctPose: formData.correctPose,
      };
      await axios.post(url, { data: data });
      fetchMoveErrors();
      showSuccess("Movimiento de entrenamiento creado con éxito");
      handleClose();
    } catch (error) {
      showError("Hubo un error al crear el movimiento de entrenamiento");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Movimiento</DialogTitle>
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
                label="SystemName"
                id="systemName"
                {...register("systemName")}
                error={!!errors.systemName}
                helperText={errors.systemName?.message}
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
              <input type="file" accept=".json" {...register("correctPose")} />
              {errors.correctPose && <div>{errors.correctPose.message}</div>}
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

export default MoveErrorCreate;
