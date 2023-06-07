import { z } from "zod";

const physicalActivityMaxLength = 100;
const personalMedicalDetailsMaxLength = 100;
const familyOtherDetailsMaxLength = 100;

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
    personalHeartDisease: z.boolean(),
    personalHeartAttack: z.boolean(),
    personalDiabetes: z.boolean(),
    personalCholesterol: z.boolean(),
    personalHypertension: z.boolean(),
    personalHypotension: z.boolean(),
    familyBoneDisease: z.boolean(),
    familyAllergies: z.boolean(),
    familyAsthma: z.boolean(),
    familyPregnancy: z.boolean(),
    familyHospitalization: z.boolean(),
    familyDrugs: z.boolean(),
    familyHypertension: z.boolean(),
    familyHypotension: z.boolean(),
    familyPsychological: z.boolean(),
    familyOther: z.boolean(),
    familyOtherDetails: z
      .string()
      .trim()
      .max(familyOtherDetailsMaxLength, {
        message: `La longitud del texto debe ser menor a ${familyOtherDetailsMaxLength} caracteres`,
      })
      .nullish(),
    personalMedicalDetails: z
      .string()
      .trim()
      .max(personalMedicalDetailsMaxLength, {
        message: `La longitud del texto debe ser menor a ${personalMedicalDetailsMaxLength} caracteres`,
      })
      .nullish()
      .transform((data) => (data === "" ? null : data)),
  })
  .refine(
    (data) => {
      return data.familyOther && !data.familyOtherDetails ? false : true;
    },
    { message: "Campo requerido", path: ["familyOtherDetails"] }
  )
  .transform((data) => {
    if (!data.familyOther) {
      data.familyOtherDetails = null;
    } else {
      data.familyOtherDetails = data.familyOtherDetails || null;
    }
    return data;
  });

export type SignupMedicalFormType = z.infer<typeof schema>;
