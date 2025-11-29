import { z } from "zod";

// Schema para atualizar configuração
export const updateConfiguracaoSchema = z.object({
  saldoInicial: z
    .number()
    .nonnegative("Saldo inicial não pode ser negativo.")
    .optional(),
  mesAtual: z
    .number()
    .int()
    .min(1, "Mês deve estar entre 1 e 12.")
    .max(12, "Mês deve estar entre 1 e 12.")
    .optional(),
});

// Schema vazio para GET (sem parâmetros)
export const emptySchema = z.object({});

// Types
export type UpdateConfiguracaoInput = z.infer<typeof updateConfiguracaoSchema>;
export type EmptyInput = z.infer<typeof emptySchema>;
