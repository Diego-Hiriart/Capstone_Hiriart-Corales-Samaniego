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
import ControlledCheckbox from "../../components/Form/ControlledCheckbox";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const SignupMedicalForm = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();
  const { user } = useContext(AuthContext);

  const medicalPersonal = JSON.parse(user!.fencer!.medicalPersonal);
  const medicalFamily = JSON.parse(user!.fencer!.medicalFamily);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isDirty },
    watch,
  } = useForm<SignupMedicalFormType>({
    defaultValues: {
      physicalActivity: user!.fencer!.physicalActivity,
      ...medicalPersonal,
      ...medicalFamily,
      personalMedicalDetails: user!.fencer!.personalMedicalDetails,
    },
    resolver: zodResolver(schema),
  });

  const handleBack = () => {
    navigate("/profile");
  };

  const onSubmit: SubmitHandler<SignupMedicalFormType> = async (formData) => {
    try {
      const medicalPersonal = {
        personalHeartDisease: formData.personalHeartDisease,
        personalHeartAttack: formData.personalHeartAttack,
        personalDiabetes: formData.personalDiabetes,
        personalCholesterol: formData.personalCholesterol,
        personalHypertension: formData.personalHypertension,
        personalHypotension: formData.personalHypotension,
      };
      const medicalFamily = {
        familyBoneDisease: formData.familyBoneDisease,
        familyAllergies: formData.familyAllergies,
        familyAsthma: formData.familyAsthma,
        familyPregnancy: formData.familyPregnancy,
        familyHospitalization: formData.familyHospitalization,
        familyDrugs: formData.familyDrugs,
        familyHypertension: formData.familyHypertension,
        familyHypotension: formData.familyHypotension,
        familyPsychological: formData.familyPsychological,
        familyOther: formData.familyOther,
        familyOtherDetails: formData.familyOtherDetails,
      };
      const data = {
        ...formData,
        medicalPersonal: JSON.stringify(medicalPersonal),
        medicalFamily: JSON.stringify(medicalFamily),
      };
      Object.keys(medicalPersonal).forEach((key) => {
        delete data[key as keyof SignupMedicalFormType];
      });
      Object.keys(medicalFamily).forEach((key) => {
        delete data[key as keyof SignupMedicalFormType];
      });
      await axios.put(`/dashboard/fencer/${user?.fencer?.fencerID}`, { data: data });
      showSuccess("Perfil actualizado correctamente");
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
              id="familyOtherDetails"
              {...register("familyOtherDetails")}
              error={!!errors.familyOtherDetails}
              helperText={errors.familyOtherDetails?.message}
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
              {...register("personalMedicalDetails")}
              error={!!errors.personalMedicalDetails}
              helperText={errors.personalMedicalDetails?.message}
            />
            <Stack direction="row" spacing={2} mt={3}>
              <Button fullWidth variant="outlined" onClick={handleBack}>
                Cancelar
              </Button>
              <Button type="submit" fullWidth variant="contained" disabled={!isDirty}>
                Guardar Cambios
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupMedicalForm;
