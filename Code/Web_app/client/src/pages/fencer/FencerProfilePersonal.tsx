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
import { useNavigate } from "react-router-dom";
import {
  SignupPersonalFormType,
  schema,
  leadSources,
  inscriptionReasons,
  bloodTypes,
} from "./validations/SignupPersonalFormValidation";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import dayjs from "dayjs";

const FencerProfilePersonal = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();
  const { user } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<SignupPersonalFormType>({
    defaultValues: {
          ...user?.fencer,
          bloodType: user?.fencer
            ?.bloodType as SignupPersonalFormType["bloodType"],
          sex: user?.fencer?.sex as SignupPersonalFormType["sex"],
          birthDate: dayjs(user?.fencer?.birthDate),
          leadSource: user?.fencer
            ?.leadSource as SignupPersonalFormType["leadSource"],
          inscriptionReason: user?.fencer
            ?.inscriptionReason as SignupPersonalFormType["inscriptionReason"],
          hasInsurance: user?.fencer?.insurance ? true : false,
        },
    resolver: zodResolver(schema),
  });

  const handleBack = () => {
    navigate("/profile");
  }

  const onSubmit: SubmitHandler<SignupPersonalFormType> = async (formData) => {
    try {
      await axios.put(`/dashboard/fencer/${user?.fencer?.fencerID}`, {data: formData});
      showSuccess("Información personal actualizada con éxito");
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
            defaultValue={null}
            control={control}
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
            id="legalGuardianPhone"
            label="Telefono del Representante"
            {...register("legalGuardianPhone")}
            error={!!errors.legalGuardianPhone}
            helperText={errors.legalGuardianPhone?.message}
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
                    <MenuItem key={leadSource} value={leadSource}>
                      {leadSource}
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
                    <MenuItem key={inscriptionReason} value={inscriptionReason}>
                      {inscriptionReason}
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
            <Button fullWidth variant="outlined" onClick={handleBack}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Guardar Cambios
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default FencerProfilePersonal;