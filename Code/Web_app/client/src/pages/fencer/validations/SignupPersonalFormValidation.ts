import { z } from "zod";
import dayjs, { Dayjs, isDayjs } from "dayjs";

export const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const leadSources = [
  { value: "Redes Sociales", label: "Redes Sociales" },
  { value: "Referido", label: "Referido" },
  { value: "Otro", label: "Otro" },
] as const;
type leadSource = (typeof leadSources)[number]["value"];
const leadSourceValues: [leadSource, ...leadSource[]] = [
  leadSources[0].value,
  ...leadSources.slice(1).map((ls) => ls.value),
];

export const inscriptionReasons = [
  { value: "Competencia", label: "Competencia" },
  { value: "Hobby", label: "Hobby" },
  { value: "Otro", label: "Otro" },
] as const;
type inscriptionReason = (typeof inscriptionReasons)[number]["value"];
const inscriptionReasonValues: [inscriptionReason, ...inscriptionReason[]] = [
  inscriptionReasons[0].value,
  ...inscriptionReasons.slice(1).map((ir) => ir.value),
];

export const schema = z
  .object({
    // TODO: validar cedula
    idNumber: z
      .string()
      .regex(/^\d+$/, { message: "Cédula inválida" })
      .length(10, { message: "Cédula inválida" })
      .trim(),
    phone: z
      .string()
      .regex(/^\d+$/, {
        message: "Teléfono inválido, debe contener 10 dígitos",
      })
      .length(10, { message: "Teléfono inválido, debe contener 10 dígitos." })
      .trim(),
    emergencyPhone: z
      .string()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" })
      .trim(),
    bloodType: z
      .enum(bloodTypes)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    sex: z.enum(["M", "F"]),
    occupation: z.string().trim().nonempty({ message: "Campo requerido" }),
    birthDate: z
      .preprocess(
        (input) => (isDayjs(input) ? input.toDate() : null),
        z
          .date()
          .min(new Date("1900-01-01"), { message: "Fecha no válida" })
          .max(new Date(), { message: "Fecha no válida" })
          .or(z.null())
          .or(z.instanceof(dayjs as unknown as typeof Dayjs))
      )
      .refine((input) => input !== null, {
        message: "Campo requerido",
      }),
    school: z.string().trim().nonempty({ message: "Campo requerido" }).trim(),
    legalGuardian: z.string().trim().nonempty({ message: "Campo requerido" }),
    guardianPhone: z
      .string()
      .trim()
      .regex(/^\d+$/, { message: "Teléfono inválido" })
      .length(10, { message: "Teléfono inválido" }),
    leadSource: z
      .enum(leadSourceValues)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    inscriptionReason: z
      .enum(inscriptionReasonValues)
      .or(z.literal(""))
      .refine((input) => input !== "", {
        message: "Campo requerido",
      }),
    hasInsurance: z.boolean(),
    insurance: z.string().trim().optional(),
  })
  .refine(
    ({ hasInsurance, insurance }) => {
      const isValid = insurance !== undefined && insurance !== "";
      return hasInsurance ? isValid : true;
    },
    { message: "Campo requerido", path: ["insurance"] }
  );

export type SignupPersonalFormType = z.infer<typeof schema>;
