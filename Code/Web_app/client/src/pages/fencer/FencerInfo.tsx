import { Box, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAlert } from "../../hooks/useAlert";
import axios from "../../services/axios";
import { Fencer } from "../../types";

const profileFields = [
  { label: "Nombres", value: "names" },
  { label: "Apellidos", value: "lastNames" },
  { label: "Email", value: "email" },
] as const;

const personalFields = [
  { label: "Cédula", value: "idNumber" },
  { label: "Teléfono", value: "phone" },
  { label: "Teléfono de emergencia", value: "emergencyPhone" },
  { label: "Tipo de sangre", value: "bloodType" },
  { label: "Sexo", value: "sex" },
  { label: "Ocupacion", value: "occupation" },
  { label: "Escuela/Colegio", value: "school" },
  { label: "Representante", value: "legalGuardian" },
  { label: "Teléfono del representante", value: "legalGuardianPhone" },
  { label: "Como te enteraste de la academia?", value: "leadSource" },
  { label: "Razon de inscripción", value: "inscriptionReason" },
  { label: "Seguro médico", value: "insurance" },
] as const;

const fencerFields = [
  { label: "Lateralidad", value: "laterality" },
  { label: "Arma", value: "weapon" },
  { label: "Peso", value: "weight" },
  { label: "Altura", value: "height" },
  { label: "Horario", value: "schedule" },
] as const;

const medicalFamilyFields = [
  { label: "Enfermedad cardiaca", value: "familyHeartDisease" },
  { label: "Infarto", value: "familyHeartAttack" },
  { label: "Diabetes", value: "familyDiabetes" },
  { label: "Problemas de colesterol", value: "familyCholesterol" },
  { label: "Hipertensión", value: "familyHypertension" },
  { label: "Hipotensión", value: "familyHypotension" },
] as const;

const medicalPersonalFields = [
  {
    label: "Problemas de articulaciones o huesos",
    value: "personalBoneDisease",
  },
  { label: "Alergias", value: "personalAllergies" },
  { label: "Asma", value: "personalAsthma" },
  { label: "Embarazo", value: "personalPregnancy" },
  {
    label: "Hospitalización en los últimos 2 meses",
    value: "personalHospitalization",
  },
  { label: "Medicamentos que toma de forma regular", value: "personalDrugs" },
  { label: "Hipertensión", value: "personalHypertension" },
  { label: "Hipotensión", value: "personalHypotension" },
  { label: "Apoyo psicológico", value: "personalPsychological" },
  { label: "Otros detalles Medicos", value: "personalOtherDetails" },
] as const;

const FencerInfo = () => {
  const { id } = useParams();
  const [fencer, setFencer] = useState<Fencer>();
  const [medicalFamilyData, setMedicalFamilyData] = useState();
  const [medicalPersonalData, setMedicalPersonalData] = useState();
  const { showError } = useAlert();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const url = `/dashboard/fencer/${id}`;
      const { data } = await axios.get(url);
      setFencer(data.data);
      setMedicalFamilyData(JSON.parse(data.data.medicalFamily));
      setMedicalPersonalData(JSON.parse(data.data.medicalPersonal));
    };
    fetchUserInfo().catch((error) => {
      showError("Hubo un error al cargar la información del usuario");
      console.error(error);
    });
  }, []);

  if (!fencer) {
    return null;
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        my={{ xs: 3, sm: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="h1" variant="h1">
          Información de usuario
        </Typography>
        <Typography
          component="h2"
          variant="h2"
          mt={3}
          fontSize={23}
          fontWeight={600}
        >
          Información de perfil
        </Typography>
        {profileFields.map((field) => (
          <DisplayField
            key={field.label}
            label={field.label}
            value={fencer.user[field.value]}
          />
        ))}
        <Typography
          component="h2"
          variant="h2"
          mt={3}
          fontSize={23}
          fontWeight={600}
        >
          Información personal
        </Typography>
        {personalFields.map((field) => {
          const value = fencer[field.value];
          return (
            <DisplayField
              key={field.label}
              label={field.label}
              value={value ? String(value) : "N/A"}
            />
          );
        })}
        <DisplayField
          label={"Fecha de nacimiento"}
          value={dayjs(fencer?.birthDate).format("DD MMMM YYYY")}
        />
        <Typography
          component="h2"
          variant="h2"
          mt={3}
          fontSize={23}
          fontWeight={600}
        >
          Información de esgrimista
        </Typography>
        {fencerFields.map((field) => {
          const value = fencer[field.value];
          return (
            <DisplayField
              key={field.label}
              label={field.label}
              value={value ? String(value) : "N/A"}
            />
          );
        })}
        <Typography
          component="h2"
          variant="h2"
          mt={3}
          fontSize={23}
          fontWeight={600}
        >
          Información Medica Familiar
        </Typography>
        {medicalFamilyFields.map((field) => {
          const value = medicalFamilyData?.[field.value] ? "Si" : "No";
          return (
            <DisplayField key={field.label} label={field.label} value={value} />
          );
        })}
        <Typography
          component="h2"
          variant="h2"
          mt={3}
          fontSize={23}
          fontWeight={600}
        >
          Información Medica Personal
        </Typography>
        {medicalPersonalFields.map((field) => {
          const value = medicalPersonalData?.[field.value] ? "Si" : "No";
          return (
            <DisplayField key={field.label} label={field.label} value={value} />
          );
        })}
      </Box>
    </Container>
  );
};

const DisplayField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <span css={{ fontWeight: 500 }}>{label}</span>: {value}
    </div>
  );
};

export default FencerInfo;
