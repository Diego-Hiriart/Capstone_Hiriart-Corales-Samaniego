import {
  Container,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from "@mui/material";
import { useAlert } from "../../hooks/useAlert";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const MAX_SCHEDULE_LENGTH = 40;
const MAX_WEIGHT = 200;
const MAX_HEIGHT = 300;

const schema = z.object({
  laterality: z.enum(["D", "I"]),
  weight: z.coerce
    .number()
    .gt(0, { message: "Peso inválido" })
    .lt(MAX_WEIGHT, { message: "Peso inválido" }),
  height: z.coerce
    .number()
    .gt(0, { message: "Altura inválida" })
    .lt(MAX_HEIGHT, { message: "Altura inválida" }),
  schedule: z
    .string()
    .trim()
    .min(1, { message: "Campo requerido" })
    .max(MAX_SCHEDULE_LENGTH, {
      message: `El horario debe tener menos de ${MAX_SCHEDULE_LENGTH} caracteres`,
    }),
});

type SignupFencerFormType = z.infer<typeof schema>;

const SignupFencerForm = () => {
  const navigate = useNavigate();
  const { showError } = useAlert();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFencerFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFencerFormType> = async (formData) => {
    try {
      console.log(formData);
    } catch (error) {
      showError("Ha ocurrido un error al crear el entrenador");
    }
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
        <Typography component="h1" variant="h5">
          Información de Esgrimista
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 5 }}
        >
          <Controller
            name="laterality"
            defaultValue="D"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Lateralidad</FormLabel>
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value="D"
                    control={<Radio />}
                    label="Diestro"
                  />
                  <FormControlLabel
                    value="I"
                    control={<Radio />}
                    label="Zurdo"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
          <TextField
            required
            fullWidth
            type="number"
            margin="normal"
            id="weight"
            label="Peso"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            {...register("weight")}
            error={!!errors.weight}
            helperText={errors.weight?.message}
          />
          <TextField
            required
            fullWidth
            type="number"
            margin="normal"
            id="height"
            label="Altura"
            InputProps={{
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
            {...register("height")}
            error={!!errors.height}
            helperText={errors.height?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="schedule"
            label="Horario"
            {...register("schedule")}
            error={!!errors.schedule}
            helperText={errors.schedule?.message}
          />
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/signup/personal")}
            >
              Atrás
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Registrarse
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupFencerForm;
