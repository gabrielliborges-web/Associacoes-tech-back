import { z } from "zod";

// Schema para item de entrada financeira
export const createEntradaFinanceiraSchema = z.object({
  tipo: z
    .string()
    .min(3, "Tipo deve ter no mínimo 3 caracteres.")
    .max(100, "Tipo não pode exceder 100 caracteres."),
  valor: z.number().positive("Valor deve ser maior que zero."),
  descricao: z
    .string()
    .max(1000, "Observação não pode exceder 1000 caracteres.")
    .optional()
    .nullable(),
  data: z.string().datetime().optional().nullable(),
});

// Schema para atualizar entrada financeira
export const updateEntradaFinanceiraSchema = z.object({
  tipo: z
    .string()
    .min(3, "Tipo deve ter no mínimo 3 caracteres.")
    .max(100, "Tipo não pode exceder 100 caracteres.")
    .optional(),
  valor: z.number().positive("Valor deve ser maior que zero.").optional(),
  descricao: z
    .string()
    .max(1000, "Observação não pode exceder 1000 caracteres.")
    .optional()
    .nullable(),
  data: z.string().datetime().optional().nullable(),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Schema para filtros de listagem
export const listEntradasSchema = z.object({
  tipo: z.string().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  usuarioId: z.number().optional(),
});

// Types
export type CreateEntradaFinanceiraInput = z.infer<
  typeof createEntradaFinanceiraSchema
>;
export type UpdateEntradaFinanceiraInput = z.infer<
  typeof updateEntradaFinanceiraSchema
>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type ListEntradasInput = z.infer<typeof listEntradasSchema>;
