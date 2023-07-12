import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ControlledCheckbox from "../../components/Form/ControlledCheckbox";
import { useAlert } from "../../hooks/useAlert";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import axios from "../../services/axios";
import {
  schema,
  SignupMedicalFormType,
} from "./validations/SignupMedicalFormValidation";

const SignupMedicalForm = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();
  const { multiFormState, setMultiFormState, registrationToken } =
    useMultiStepForm();
  const {
    control,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<SignupMedicalFormType>({
    defaultValues: multiFormState,
    resolver: zodResolver(schema),
  });

  const handleBack = () => {
    setMultiFormState({ ...multiFormState, ...getValues() });
    navigate("/signup/fencer");
  };

  const onSubmit: SubmitHandler<SignupMedicalFormType> = async (formData) => {
    try {
      setMultiFormState({ ...multiFormState, ...formData });
      const medicalFamily = {
        familyHeartDisease: formData.familyHeartDisease,
        familyHeartAttack: formData.familyHeartAttack,
        familyDiabetes: formData.familyDiabetes,
        familyCholesterol: formData.familyCholesterol,
        familyHypertension: formData.familyHypertension,
        familyHypotension: formData.familyHypotension,
      };
      const medicalPersonal = {
        personalBoneDisease: formData.personalBoneDisease,
        personalAllergies: formData.personalAllergies,
        personalAsthma: formData.personalAsthma,
        personalPregnancy: formData.personalPregnancy,
        personalHospitalization: formData.personalHospitalization,
        personalDrugs: formData.personalDrugs,
        personalHypertension: formData.personalHypertension,
        personalHypotension: formData.personalHypotension,
        personalPsychological: formData.personalPsychological,
        personalOther: formData.personalOther,
        personalOtherDetails: formData.personalOtherDetails,
      };
      const data = {
        ...multiFormState,
        ...formData,
        medicalFamily: JSON.stringify(medicalFamily),
        medicalPersonal: JSON.stringify(medicalPersonal),
      };
      Object.keys(medicalFamily).forEach((key) => {
        delete data[key as keyof SignupMedicalFormType];
      });
      Object.keys(medicalPersonal).forEach((key) => {
        delete data[key as keyof SignupMedicalFormType];
      });
      await axios.post("auth/user/fencer", { data, token: registrationToken });
      showSuccess("Esgrimista creado exitosamente");
      navigate("/login");
    } catch (error) {
      showError("Ha ocurrido un error al crear el esgrimista");
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
          Información Medica
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
            {...register("physicalActivity")}
            error={!!errors.physicalActivity}
            helperText={errors.physicalActivity?.message}
          />
          <Typography mt={3} variant="h6">
            Antecedentes medicos familiares
          </Typography>
          <Stack>
            <ControlledCheckbox
              label="Enfermedad cardiaca"
              name="familyHeartDisease"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Infarto"
              name="familyHeartAttack"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Diabetes"
              name="familyDiabetes"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Problemas de colesterol"
              name="familyCholesterol"
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
            <Typography mt={3} variant="h6">
              Antecedentes medicos personales
            </Typography>
            <ControlledCheckbox
              label="Problemas de articulaciones o huesos"
              name="personalBoneDisease"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Alergias"
              name="personalAllergies"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Asma"
              name="personalAsthma"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Embarazo"
              name="personalPregnancy"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Hospitalización en los últimos 2 meses"
              name="personalHospitalization"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Medicamentos que toma de forma regular"
              name="personalDrugs"
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
            <ControlledCheckbox
              label="Apoyo psicológico"
              name="personalPsychological"
              control={control}
              defaultValue={false}
            />
            <ControlledCheckbox
              label="Otro"
              name="personalOther"
              control={control}
              defaultValue={false}
            />
            <TextField
              disabled={!watch("personalOther")}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              label="Especificar otro"
              id="personalOtherDetails"
              {...register("personalOtherDetails")}
              error={!!errors.personalOtherDetails}
              helperText={errors.personalOtherDetails?.message}
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
              {...register("medicalDetails")}
              error={!!errors.medicalDetails}
              helperText={errors.medicalDetails?.message}
            />
            <Stack direction="row" spacing={2} mt={3}>
              <Button fullWidth variant="outlined" onClick={handleBack}>
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
