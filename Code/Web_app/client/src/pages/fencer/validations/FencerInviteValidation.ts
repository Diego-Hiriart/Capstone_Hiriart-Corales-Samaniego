import { z } from "zod";

const baseSchema = z.object({
  names: z.string().nonempty({ message: "Campo requerido" }),
  lastNames: z.string().nonempty({ message: "Campo requerido" }),
});

export const schema = z
  .discriminatedUnion("isGuest", [
    z.object({
      isGuest: z.literal(true),
      email: z
        .string()
        .email({ message: "Email inválido" })
        .optional()
        .or(z.literal("")),
    }),
    z.object({
      isGuest: z.literal(false),
      email: z.string().email({ message: "Email inválido" }),
    }),
  ])
  .and(baseSchema);

export type FencerInviteForm = z.infer<typeof schema>;
