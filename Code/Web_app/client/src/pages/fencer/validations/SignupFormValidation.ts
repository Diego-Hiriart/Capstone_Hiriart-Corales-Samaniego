import { z } from "zod";

export const schema = z
  .object({
    names: z.string().trim().nonempty({ message: "Campo requerido" }),
    lastNames: z.string().trim().nonempty({ message: "Campo requerido" }),
    email: z.string().email({ message: "Correo inválido" }),
    password: z.string().min(8, { message: "Contraseña inválida" }),
    confirmPassword: z.string().min(8, { message: "Contraseña inválida" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignupFormType = z.infer<typeof schema>;
