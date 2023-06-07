import { z } from "zod";

const scheduleMaxLength = 40;
const maxWeight = 200;
const maxHeight = 300;

export const schema = z.object({
  laterality: z.enum(["D", "I"]),
  weapon: z.enum(["Espada", "Florete", "Sable"]),
  weight: z.coerce
    .number()
    .gt(0, { message: "Peso inválido" })
    .lt(maxWeight, { message: "Peso inválido" }),
  height: z.coerce
    .number()
    .gt(0, { message: "Altura inválida" })
    .lt(maxHeight, { message: "Altura inválida" }),
  schedule: z
    .string()
    .trim()
    .min(1, { message: "Campo requerido" })
    .max(scheduleMaxLength, {
      message: `El horario debe tener menos de ${scheduleMaxLength} caracteres`,
    }),
});

export type SignupFencerFormType = z.infer<typeof schema>;
