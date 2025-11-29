import { z } from "zod";

// Schema para criar usuário (por admin/superadmin)
export const createUserSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional().default("USER"),
  theme: z.enum(["LIGHT", "DARK"]).optional().default("DARK"),
  ativo: z.boolean().optional().default(true),
});

// Schema para atualizar usuário
export const updateUserSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .optional(),
  email: z.string().email("E-mail inválido.").optional(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
  theme: z.enum(["LIGHT", "DARK"]).optional(),
  ativo: z.boolean().optional(),
});

// Schema para atualizar tema
export const updateThemeSchema = z.object({
  theme: z
    .enum(["LIGHT", "DARK"])
    .refine(
      (val) => ["LIGHT", "DARK"].includes(val),
      "Tema deve ser DARK ou LIGHT."
    ),
});

// Schema para atualizar senha
export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Senha atual é obrigatória."),
  newPassword: z
    .string()
    .min(6, "A nova senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A nova senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A nova senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A nova senha deve conter pelo menos um número."),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)), {
    message: "ID deve ser um número válido.",
  }),
});

// Types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
