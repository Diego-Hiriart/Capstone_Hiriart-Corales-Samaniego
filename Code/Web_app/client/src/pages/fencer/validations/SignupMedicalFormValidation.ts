import { z } from "zod";

const physicalActivityMaxLength = 100;
const medicalDetailsMaxLength = 100;
const personalOtherDetailsMaxLength = 100;

export const schema = z
  .object({
    physicalActivity: z
      .string()
      .trim()
      .max(physicalActivityMaxLength, {
        message: `La longitud del texto debe ser menor a ${physicalActivityMaxLength}`,
      })
      .nullish()
      .transform((data) => (data === "" ? null : data)),
    familyHeartDisease: z.boolean(),
    familyHeartAttack: z.boolean(),
    familyDiabetes: z.boolean(),
    familyCholesterol: z.boolean(),
    familyHypertension: z.boolean(),
    familyHypotension: z.boolean(),
    personalBoneDisease: z.boolean(),
    personalAllergies: z.boolean(),
    personalAsthma: z.boolean(),
    personalPregnancy: z.boolean(),
    personalHospitalization: z.boolean(),
    personalDrugs: z.boolean(),
    personalHypertension: z.boolean(),
    personalHypotension: z.boolean(),
    personalPsychological: z.boolean(),
    personalOther: z.boolean(),
    personalOtherDetails: z
      .string()
      .trim()
      .max(personalOtherDetailsMaxLength, {
        message: `La longitud del texto debe ser menor a ${personalOtherDetailsMaxLength} caracteres`,
      })
      .nullish(),
    personalMedicalDetails: z
      .string()
      .trim()
      .max(medicalDetailsMaxLength, {
        message: `La longitud del texto debe ser menor a ${medicalDetailsMaxLength} caracteres`,
      })
      .nullish()
      .transform((data) => (data === "" ? null : data)),
  })
  .refine(
    (data) => {
      return data.personalOther && !data.personalOtherDetails ? false : true;
    },
    { message: "Campo requerido", path: ["personalOtherDetails"] }
  )
  .transform((data) => {
    if (!data.personalOther) {
      data.personalOtherDetails = null;
    } else {
      data.personalOtherDetails = data.personalOtherDetails || null;
    }
    return data;
  });

export type SignupMedicalFormType = z.infer<typeof schema>;
