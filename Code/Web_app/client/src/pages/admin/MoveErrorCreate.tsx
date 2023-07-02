import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseJsonFile } from "../../utils/files";

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
      return await parseJsonFile(fileList?.[0]!);
    }),
});

type MoveErrorCreateFormType = z.infer<typeof schema>;

const MoveErrorCreate = () => {

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MoveErrorCreateFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: MoveErrorCreateFormType) => {
    console.log(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        my={{ xs: 3, sm: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Errores de entrenamiento
        </Typography>
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
          <input
            type="file"
            accept=".json"
            {...register("correctPose")}
          />
          {errors.correctPose && <div>{errors.correctPose.message}</div>}
          <Box mt={2}>
            <Button type="submit" variant="outlined">
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MoveErrorCreate;
