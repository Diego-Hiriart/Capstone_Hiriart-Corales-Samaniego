import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SignupMedicalFormType,
  schema,
} from "./validations/SignupMedicalFormValidation";
import { useAlert } from "../../hooks/useAlert";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import ControlledCheckbox from "../../components/Form/ControlledCheckbox";
import { useNavigate } from "react-router-dom";

const SignupMedicalForm = () => {
  const navigate = useNavigate();
  const { showError } = useAlert();
  const { multiFormState, setMultiFormState } = useMultiStepForm();
  const {
    control,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<SignupMedicalFormType>({
    defaultValues: { ...multiFormState },
    resolver: zodResolver(schema),
  });

  const handleBack = () => {
    setMultiFormState({ ...multiFormState, ...getValues() })
    navigate("/signup/fencer");
  }

  const onSubmit: SubmitHandler<SignupMedicalFormType> = async (formData) => {
    try {
      console.log(formData);
      setMultiFormState({ ...multiFormState, ...formData });
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
        <Typography component="h1" variant="h4">
          Información Personal
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
            multiline
            rows={4}
            label="Realizas algún tipo de actividad física?"
            id="physicalActivity"
            defaultValue={""}
            {...register("physicalActivity")}
          />
          <Typography mt={3} variant="h6">
            Antecedentes medicos personales
          </Typography>
          <Stack>
            <ControlledCheckbox
              label="Enfermedad cardiaca"
              name="personalHeartDisease"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Infarto"
              name="personalHeartAttack"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Diabetes"
              name="personalDiabetes"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Problemas de colesterol"
              name="personalCholesterol"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hipertensión"
              name="personalHypertension"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hipotensión"
              name="personalHypotension"
              control={control}
              defaultValue={false}
            />
            <Typography mt={3} variant="h6">
              Antecedentes medicos familiares
            </Typography>
            <ControlledCheckbox
              label="Problemas de articulaciones o huesos"
              name="familyBoneDisease"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Alergias"
              name="familyAllergies"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Asma"
              name="familyAsthma"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Embarazo"
              name="familyPregnancy"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hospitalización en los últimos 2 meses"
              name="familyHospitalization"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Medicamentos que toma de forma regular"
              name="familyDrugs"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hipertensión"
              name="familyHypertension"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hipotensión"
              name="familyHypotension"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Apoyo psicológico"
              name="familyPsychological"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Otro"
              name="familyOther"
              control={control}
              defaultValue={false}
            />
            <TextField
              disabled={!watch("familyOther")}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              label="Especificar otro"
              id="medicalFamilyOther"
              defaultValue={""}
              {...register("medicalFamilyOther")}
              error={!!errors.medicalFamilyOther}
              helperText={errors.medicalFamilyOther?.message}
            />
            <Typography>
              Si marcaste alguna condicion anterior por favor especificar
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              multiline
              rows={4}
              // TODO: Change label
              id="personalMedicalDetails"
              defaultValue={""}
              {...register("personalMedicalDetails")}
              error={!!errors.personalMedicalDetails}
              helperText={errors.personalMedicalDetails?.message}
            />
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
              >
                Atrás
              </Button>
              <Button type="submit" fullWidth variant="contained">
                Registrarse
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupMedicalForm;
