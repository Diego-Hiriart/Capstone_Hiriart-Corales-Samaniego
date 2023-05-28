import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SignupMedicalFormType,
  schema,
} from "./validations/SignupMedicalFormValidation";
import { useAlert } from "../../hooks/useAlert";
import useMultiStepForm from "../../hooks/useMultiStepForm";
import ControlledCheckbox from "../../components/Form/ControlledCheckbox";

const SignupMedicalForm = () => {
  const { showError } = useAlert();
  const { formState, setFormState } = useMultiStepForm();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupMedicalFormType>({
    defaultValues: { ...formState },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupMedicalFormType> = async (formData) => {
    try {
      console.log(formData);
      setFormState({ ...formState, ...formData });
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
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Actividad Física"
            id="physicalActivity"
            defaultValue={""}
            {...register("physicalActivity")}
          />
          <ControlledCheckbox 
            label="Enfermedad cardiaca" 
            name="heartDisease"
            control={control}
            defaultValue={false}
          />
          <ControlledCheckbox 
            label="Infarto" 
            name="heartAttack"
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
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Si respondiste que si a alguna condicion por favor especificar"
            id="personalMedicalDetails"
            defaultValue={""}
            {...register("personalMedicalDetails")}
            error={!!errors.personalMedicalDetails}
            helperText={errors.personalMedicalDetails?.message}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default SignupMedicalForm;
