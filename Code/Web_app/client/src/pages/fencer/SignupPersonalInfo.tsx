import { Box, Container, TextField, Typography } from "@mui/material";
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

const schema = z.object({
  idNumber: z.string().nonempty({ message: "Campo requerido" }),
  phone: z.string().nonempty({ message: "Campo requerido" }),
  emergencyPhone: z.string().nonempty({ message: "Campo requerido" }),
  bloodType: z.string().nonempty({ message: "Campo requerido" }),
  sex: z.literal("M").or(z.literal("F")),
  occupation: z.string().nonempty({ message: "Campo requerido" }),
  birthDate: z.date(),
  school: z.string().nonempty({ message: "Campo requerido" }), // TODO: add to fencer prisma model
  legalGuardian: z.string().nonempty({ message: "Campo requerido" }),
  guardianPhone: z.string().nonempty({ message: "Campo requerido" }),
  leadSource: z.string().nonempty({ message: "Campo requerido" }),
  inscriptionReason: z.string().nonempty({ message: "Campo requerido" }),
  insurance: z.string().nonempty({ message: "Campo requerido" }),
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
          <TextField
            required
            fullWidth
            margin="normal"
            id="bloodType"
            label="Tipo de Sangre"
            {...register("bloodType")}
            error={!!errors.bloodType}
            helperText={errors.bloodType?.message}
          />
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
            defaultValue={null}
            control={control}
            inputFormat="DD-MM-YYYY"
            render={({ field }) => {
              <DatePicker value={ field.value } onChange={(e) => field.onChange(e) }/>
            }}
          >
          </Controller>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPersonalInfo;
