import { z } from "zod";

// Schema para cadastro de primeiro usuário + associação
export const signupPrimeiroUsuarioSchema = z.object({
  // Dados do usuário
  nomeUsuario: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  senha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um símbolo especial."),

  // Dados da associação
  nomeAssociacao: z
    .string()
    .min(3, "O nome da associação deve ter pelo menos 3 caracteres."),
  apelidoAssociacao: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  theme: z.enum(["LIGHT", "DARK"]).optional().default("DARK"),
});

export const signupSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  senha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um símbolo especial."),
  theme: z.enum(["LIGHT", "DARK"]).optional().default("DARK"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres."),
});

export const sendResetCodeSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

export const validateCodeSchema = z.object({
  email: z.string().email("E-mail inválido."),
  code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos."),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
  code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos."),
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um símbolo especial."),
});

export type SignupPrimeiroUsuarioInput = z.infer<
  typeof signupPrimeiroUsuarioSchema
>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SendResetCodeInput = z.infer<typeof sendResetCodeSchema>;
export type ValidateCodeInput = z.infer<typeof validateCodeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
