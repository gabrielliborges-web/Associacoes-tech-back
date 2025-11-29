import { z } from "zod";

export const createDespesaSchema = z.object({
  descricao: z
    .string()
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(255, "Descrição deve ter no máximo 255 caracteres"),
  tipo: z
    .string()
    .min(1, "Tipo é obrigatório")
    .max(50, "Tipo deve ter no máximo 50 caracteres"),
  valor: z
    .number()
    .positive("Valor deve ser maior que zero")
    .finite("Valor deve ser um número válido"),
  observacao: z
    .string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional(),
  data: z.string().datetime().optional(),
});

export const updateDespesaSchema = z.object({
  descricao: z
    .string()
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(255, "Descrição deve ter no máximo 255 caracteres")
    .optional(),
  tipo: z
    .string()
    .min(1, "Tipo é obrigatório")
    .max(50, "Tipo deve ter no máximo 50 caracteres")
    .optional(),
  valor: z
    .number()
    .positive("Valor deve ser maior que zero")
    .finite("Valor deve ser um número válido")
    .optional(),
  observacao: z
    .string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional(),
  data: z.string().datetime().optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID deve ser um número").transform(Number),
});

export const filtrosListagemSchema = z.object({
  tipo: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  valorMinimo: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Valor mínimo inválido")
    .transform(Number)
    .optional(),
  valorMaximo: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Valor máximo inválido")
    .transform(Number)
    .optional(),
});

export const emptySchema = z.object({});

export type CreateDespesaInput = z.infer<typeof createDespesaSchema>;
export type UpdateDespesaInput = z.infer<typeof updateDespesaSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type FiltrosListagem = z.infer<typeof filtrosListagemSchema>;
export type EmptyInput = z.infer<typeof emptySchema>;
