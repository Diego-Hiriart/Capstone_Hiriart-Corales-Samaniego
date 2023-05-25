import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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

const bloodTypes = [
  "",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const leadSources = [
  { value: "", label: "" }, // TODO: find way to not use this
  { value: "Redes Sociales", label: "Redes Sociales" },
  { value: "Referido", label: "Referido" },
  { value: "Otro", label: "Otro" },
] as const;
type leadSource = (typeof leadSources)[number]["value"];
const leadSourceValues: [leadSource, ...leadSource[]] = [
  leadSources[0].value,
  ...leadSources.slice(1).map((ls) => ls.value),
];

const inscriptionReasons = [
  { value: "", label: "" }, // TODO: find way to not use this
  { value: "Competencia", label: "Competencia" },
  { value: "Hobby", label: "Hobby" },
  { value: "Otro", label: "Otro" },
] as const;
type inscriptionReason = (typeof inscriptionReasons)[number]["value"];
const inscriptionReasonValues: [inscriptionReason, ...inscriptionReason[]] = [
  inscriptionReasons[0].value,
  ...inscriptionReasons.slice(1).map((ir) => ir.value),
];

const schema = z
  .object({
    // TODO: validar cedula
    idNumber: z
      .string()
      .regex(/^\d+$/, { message: "Cédula inválida" })
      .length(10, { message: "Cédula inválida" })
      .trim(),
    phone: z
      .string()
      .regex(/^\d+$/, { message: "Teléfono inválido, debe contener 10 dígitos" })
      .length(10, { message: "Teléfono inválido, debe contener 10 dígitos." })
      .trim(),
    emergencyPhone: z
      .string()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" })
      .trim(),
    bloodType: z.enum(bloodTypes).refine((input) => input !== "", {
      message: "Campo requerido",
    }),
    sex: z.enum(["M", "F"]),
    occupation: z.string().trim().nonempty({ message: "Campo requerido" }),
    // birthDate: z.any(), //TODO validar fecha
    school: z.string().trim().nonempty({ message: "Campo requerido" }).trim(),
    legalGuardian: z
      .string()
      .trim()
      .nonempty({ message: "Campo requerido" }),
    guardianPhone: z
      .string()
      .trim()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" }),
    leadSource: z.enum(leadSourceValues).refine((input) => input !== "", {
      message: "Campo requerido",
    }),
    inscriptionReason: z
      .enum(inscriptionReasonValues)
      .refine((ir) => ir !== "", {
        message: "Campo requerido",
      }),
    hasInsurance: z.boolean(),
    insurance: z.string().trim().optional(),
  })
  .refine(
    ({hasInsurance, insurance}) => {
      const isValid = insurance !== undefined && insurance !== "";
      return hasInsurance ? isValid : true;
    },
    { message: "Campo requerido", path: ["insurance"] }
  );

type SignupPersonalInfoForm = z.infer<typeof schema>;

const SignupPersonalInfo = () => {
  const { showError } = useAlert();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<SignupPersonalInfoForm>({
    defaultValues: {
      insurance: ""
    },
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
          <FormControl fullWidth error={!!errors.bloodType} margin="normal">
            <InputLabel id="bloodtype-label">Tipo de sangre</InputLabel>
            <Controller
              name="bloodType"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="bloodtype-label"
                  label="Tipo de sangre"
                >
                  {bloodTypes.map((bloodtype) => (
                    <MenuItem key={bloodtype} value={bloodtype}>
                      {bloodtype}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.bloodType?.message}</FormHelperText>
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
          {/* <Controller
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
          /> */}
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
          <FormControl fullWidth error={!!errors.leadSource} margin="normal">
            <InputLabel id="leadSource-label">
              Como te enteraste de la academia?
            </InputLabel>
            <Controller
              name="leadSource"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="leadSource-label"
                  id="select-label"
                  label="Como te enteraste de la academia?"
                >
                  {leadSources.map((leadSource) => (
                    <MenuItem key={leadSource.value} value={leadSource.value}>
                      {leadSource.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.leadSource?.message}</FormHelperText>
          </FormControl>
          <FormControl
            fullWidth
            error={!!errors.inscriptionReason}
            margin="normal"
          >
            <InputLabel id="inscriptionReason-label">
              Como te enteraste de la academia?
            </InputLabel>
            <Controller
              name="inscriptionReason"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="inscriptionReason-label"
                  id="select-label"
                  label="Como te enteraste de la academia?"
                >
                  {inscriptionReasons.map((inscriptionReason) => (
                    <MenuItem
                      key={inscriptionReason.value}
                      value={inscriptionReason.value}
                    >
                      {inscriptionReason.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.inscriptionReason?.message}</FormHelperText>
          </FormControl>
          <FormControlLabel
            control={<Checkbox {...register("hasInsurance")} />}
            label="¿Cuenta con seguro médico?"
          />
          <TextField
            disabled={Boolean(!watch("hasInsurance"))}
            fullWidth
            margin="normal"
            id="insurance"
            label="Nombre aseguradora"
            {...register("insurance")}
            error={!!errors.insurance && watch("hasInsurance")}
            helperText={errors.insurance?.message}
          />
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
