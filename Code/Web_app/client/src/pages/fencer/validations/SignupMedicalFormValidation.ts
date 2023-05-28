import { z } from "zod";

export const schema = z
  .object({
    physicalActivity: z.string().trim().max(100),
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
    medicalFamilyOther: z.string().trim().optional(),
    personalMedicalDetails: z.string(),
  })
  .refine((data) => {
    if (data.familyOther && !data.medicalFamilyOther) {
      return false;
    }
    return true;
  })
  .transform((data) => {
    if (!data.familyOther) {
      // delete or set to undefined?
      delete data.medicalFamilyOther;
    }
    return data;
  })

export type SignupMedicalFormType = z.infer<typeof schema>;
