import { Box, Container, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "../../hooks/useAlert";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  idNumber: z.string().nonempty({ message: "Campo requerido" }),
  phone: z.string().nonempty({ message: "Campo requerido" }),
  emergencyPhone: z.string().nonempty({ message: "Campo requerido" }),
  bloodType: z.string().nonempty({ message: "Campo requerido" }),
  sex: z.literal("M").or(z.literal("F")).or(z.literal("O")),
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
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPersonalInfo;
