import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import dayjs, { Dayjs, isDayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import useMultiStepForm from "../../hooks/useMultiStepForm";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const leadSources = [
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
  { value: "Competencia", label: "Competencia" },
  { value: "Hobby", label: "Hobby" },
  { value: "Otro", label: "Otro" },
] as const;
type inscriptionReason = (typeof inscriptionReasons)[number]["value"];
const inscriptionReasonValues: [inscriptionReason, ...inscriptionReason[]] = [
  inscriptionReasons[0].value,
  ...inscriptionReasons.slice(1).map((ir) => ir.value),
];

// TODO: move schema to utils folder
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
      .regex(/^\d+$/, {
        message: "Teléfono inválido, debe contener 10 dígitos",
      })
      .length(10, { message: "Teléfono inválido, debe contener 10 dígitos." })
      .trim(),
    emergencyPhone: z
      .string()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" })
      .trim(),
    bloodType: z
      .enum(bloodTypes)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    sex: z.enum(["M", "F"]),
    occupation: z.string().trim().nonempty({ message: "Campo requerido" }),
    birthDate: z
      .preprocess(
        (input) => (isDayjs(input) ? input.toDate() : null),
        z
          .date()
          .min(new Date("1900-01-01"), { message: "Fecha no válida" })
          .max(new Date(), { message: "Fecha no válida" })
          .or(z.null())
          .or(z.instanceof(dayjs as unknown as typeof Dayjs))
      )
      .refine((input) => input !== null, {
        message: "Campo requerido",
      }),
    school: z.string().trim().nonempty({ message: "Campo requerido" }).trim(),
    legalGuardian: z.string().trim().nonempty({ message: "Campo requerido" }),
    guardianPhone: z
      .string()
      .trim()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" }),
    leadSource: z
      .enum(leadSourceValues)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    inscriptionReason: z
      .enum(inscriptionReasonValues)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    hasInsurance: z.boolean(),
    insurance: z.string().trim().optional(),
  })
  .refine(
    ({ hasInsurance, insurance }) => {
      const isValid = insurance !== undefined && insurance !== "";
      return hasInsurance ? isValid : true;
    },
    { message: "Campo requerido", path: ["insurance"] }
  );

type SignupPersonalFormType = z.infer<typeof schema>;

const SignupPersonalForm = () => {
  const navigate = useNavigate();
  const { formState, setFormState } = useMultiStepForm();
  const { showError } = useAlert();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<SignupPersonalFormType>({
    defaultValues: {
      ...formState,
      birthDate:
        formState.birthDate instanceof Date ? dayjs(formState.birthDate) : null,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupPersonalFormType> = async (formData) => {
    try {
      const data = {
        ...formData,
        insurance: formData.hasInsurance ? formData.insurance : undefined,
      };
      setFormState({ ...formState, ...data });
      navigate("/signup/fencer");
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
          <Controller
            name="birthDate"
            control={control}
            defaultValue={null}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                disableFuture
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
            label="¿Cuenta con seguro médico?"
            control={
              <Controller
                name="hasInsurance"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
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
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/signup")}
            >
              Atrás
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Continuar
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPersonalForm;
