import { z } from "zod";

// Schema para item da venda
export const itemVendaSchema = z.object({
  produtoId: z
    .number()
    .int("produtoId deve ser um número inteiro.")
    .positive("produtoId deve ser um número positivo."),
  quantidade: z
    .number()
    .int("quantidade deve ser um número inteiro.")
    .positive("quantidade deve ser maior que zero."),
  precoUnit: z.number().positive("precoUnit deve ser maior que zero."),
});

// Schema para criar venda
export const createVendaSchema = z.object({
  formaPagamento: z
    .string()
    .min(1, "Forma de pagamento é obrigatória.")
    .max(100, "Forma de pagamento não pode exceder 100 caracteres."),
  descricao: z
    .string()
    .max(1000, "Observação não pode exceder 1000 caracteres.")
    .optional()
    .nullable(),
  data: z.string().datetime().optional().nullable(),
  itens: z
    .array(itemVendaSchema)
    .min(1, "A venda deve conter pelo menos um item."),
});

// Schema para cancelar venda
export const cancelVendaSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Schema para filtros de listagem
export const listVendasSchema = z.object({
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  formaPagamento: z.string().optional(),
  usuarioId: z.number().optional(),
});

// Types
export type CreateVendaInput = z.infer<typeof createVendaSchema>;
export type ItemVendaInput = z.infer<typeof itemVendaSchema>;
export type CancelVendaInput = z.infer<typeof cancelVendaSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type ListVendasInput = z.infer<typeof listVendasSchema>;
