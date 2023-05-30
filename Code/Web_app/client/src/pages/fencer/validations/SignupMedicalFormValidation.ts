import { z } from "zod";

const PHYSICAL_ACTIVITY_MAX_LENGTH = 100;
const PERSONAL_MEDICAL_DETAILS_MAX_LENGTH = 100;

export const schema = z
  .object({
    physicalActivity: z
      .string()
      .trim()
      .max(PHYSICAL_ACTIVITY_MAX_LENGTH, {
        message: `La longitud del texto debe ser menor a ${PHYSICAL_ACTIVITY_MAX_LENGTH}`,
      })
      .optional()
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
    familyOtherDetail: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data ? data : "")),
    personalMedicalDetail: z
      .string()
      .trim()
      .max(PERSONAL_MEDICAL_DETAILS_MAX_LENGTH, {
        message: `La longitud del texto debe ser menor a ${PERSONAL_MEDICAL_DETAILS_MAX_LENGTH} caracteres`,
      })
      .optional()
      .transform((data) => (data === "" ? null : data)),
  })
  .refine(
    (data) => {
      return data.familyOther && !data.familyOtherDetail ? false : true;
    },
    { message: "Campo requerido", path: ["familyOtherDetail"] }
  );

export type SignupMedicalFormType = z.infer<typeof schema>;
