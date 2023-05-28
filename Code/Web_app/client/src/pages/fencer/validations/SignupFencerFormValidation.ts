import { z } from "zod";

const MAX_SCHEDULE_LENGTH = 40;
const MAX_WEIGHT = 200;
const MAX_HEIGHT = 300;

export const schema = z.object({
  laterality: z.enum(["D", "I"]),
  weight: z.coerce
    .number()
    .gt(0, { message: "Peso inválido" })
    .lt(MAX_WEIGHT, { message: "Peso inválido" }),
  height: z.coerce
    .number()
    .gt(0, { message: "Altura inválida" })
    .lt(MAX_HEIGHT, { message: "Altura inválida" }),
  schedule: z
    .string()
    .trim()
    .min(1, { message: "Campo requerido" })
    .max(MAX_SCHEDULE_LENGTH, {
      message: `El horario debe tener menos de ${MAX_SCHEDULE_LENGTH} caracteres`,
    }),
});

export type SignupFencerFormType = z.infer<typeof schema>;
