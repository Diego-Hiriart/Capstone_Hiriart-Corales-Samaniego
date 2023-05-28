import { z } from "zod";

export const schema = z.object({
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
  medicalFamilyOther: z.string(),
  personalMedicalDetails: z.string(),
});

export type SignupMedicalFormType = z.infer<typeof schema>;