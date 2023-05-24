import { Box, Button, Container, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "../../hooks/useAlert";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const bloodtypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const schema = z.object({
  // TODO: validar cedula
  idNumber: z
    .string()
    .regex(/^\d+$/, { message: "Cédula inválida" })
    .length(10, { message: "Cédula inválida" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Teléfono inválido" })
    .length(10, { message: "Teléfono inválido" }),
  emergencyPhone: z
    .string()
    .regex(/^\d+$/, { message: "Teléfono inválido" })
    .length(10, { message: "Teléfono inválido" }),
  bloodType: z.enum(bloodtypes),
  sex: z.enum(["M", "F"]),
  occupation: z.string().optional(),
  birthDate: z.any(),
  school: z.string().optional(),
  legalGuardian: z.string().nonempty({ message: "Campo requerido" }),
  guardianPhone: z
    .string()
    .regex(/^\d+$/, { message: "Teléfono inválido" })
    .length(10, { message: "Teléfono inválido" }),
  leadSource: z.enum(["Redes Sociales", "Referido", "Otro"]),
  inscriptionReason: z.enum(["Competencia", "Hobby", "Otro"]),
  insurance: z.string().optional(),
});

type SignupPersonalInfoForm = z.infer<typeof schema>;

const SignupPersonalInfo = () => {
  const { showError } = useAlert();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupPersonalInfoForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupPersonalInfoForm> = async (formData) => {
    try {
      console.log(formData);
    } catch (error) {
      showError("Ha ocurrido un error al crear el entrenador");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Información Personal
        </Typography>
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
            id="idNumber"
            label="Cédula"
            autoFocus
            {...register("idNumber")}
            error={!!errors.idNumber}
            helperText={errors.idNumber?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="phone"
            label="Teléfono Móvil"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="emergencyPhone"
            label="Teléfono de Emergencia"
            {...register("emergencyPhone")}
            error={!!errors.emergencyPhone}
            helperText={errors.emergencyPhone?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="bloodtype-select-label">Tipo de sangre</InputLabel>
            <Select
              labelId="bloodtype-select-label"
              id="bloodtype-select"
              value=""
              label="Tipo de sangre"
              {...register("bloodType")}
            >
              {bloodtypes.map((bloodtype) => (
                <MenuItem key={bloodtype} value={bloodtype}>
                  {bloodtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Controller
            name="sex"
            defaultValue="M"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Sexo</FormLabel>
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    label="Masculino"
                  />
                  <FormControlLabel
                    value="F"
                    control={<Radio />}
                    label="Femenino"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="occupation"
            label="Ocupación"
            {...register("occupation")}
            error={!!errors.occupation}
            helperText={errors.occupation?.message}
          />
          <Controller
            name="birthDate"
            control={control}
            defaultValue={null}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label="Fecha de Nacimiento"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="school"
            label="Escuela/Colegio"
            {...register("school")}
            error={!!errors.school}
            helperText={errors.school?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="legalGuardian"
            label="Representante"
            {...register("legalGuardian")}
            error={!!errors.legalGuardian}
            helperText={errors.legalGuardian?.message}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="guardianPhone"
            label="Telefono del Representante"
            {...register("guardianPhone")}
            error={!!errors.guardianPhone}
            helperText={errors.guardianPhone?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="lead-select-label">Como te enteraste de la academia?</InputLabel>
            <Select
              labelId="lead-select-label"
              id="select-label"
              value=""
              label="Como te enteraste de la academia?"
              {...register("leadSource")}
            >
              <MenuItem value="">Seleccionar</MenuItem>
              <MenuItem value="Redes Sociales">Redes Sociales</MenuItem>
              <MenuItem value="Referidos">Referidos</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPersonalInfo;
