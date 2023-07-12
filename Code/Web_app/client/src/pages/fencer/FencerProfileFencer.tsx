import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import AuthContext from "../../contexts/AuthContext";
import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";
import {
  schema,
  SignupFencerFormType,
} from "./validations/SignupFencerFormValidation";

const FencerProfileFencer = () => {
  const { user } = useContext(AuthContext);
  const { showError, showSuccess } = useAlert();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SignupFencerFormType>({
    defaultValues: {
      ...user?.fencer,
      laterality: user?.fencer
        ?.laterality as SignupFencerFormType["laterality"],
      weapon: user?.fencer?.weapon as SignupFencerFormType["weapon"],
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFencerFormType> = async (formData) => {
    try {
      await axios.put(`/dashboard/fencer/${user?.fencer?.fencerID}`, {
        data: formData,
      });
      showSuccess("Perfil actualizado correctamente");
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
          <Controller
            name="weapon"
            defaultValue="Espada"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Arma</FormLabel>
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value="Espada"
                    control={<Radio />}
                    label="Espada"
                  />
                  <FormControlLabel
                    value="Sable"
                    control={<Radio />}
                    label="Sable"
                  />
                  <FormControlLabel
                    value="Florete"
                    control={<Radio />}
                    label="Florete"
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
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isDirty}
            >
              Guardar Cambios
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default FencerProfileFencer;
