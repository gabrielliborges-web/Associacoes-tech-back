import { z } from "zod";

// Schema para item da compra
export const itemCompraSchema = z.object({
  produtoId: z
    .number()
    .int("produtoId deve ser um número inteiro.")
    .positive("produtoId deve ser um número positivo."),
  quantidade: z
    .number()
    .int("quantidade deve ser um número inteiro.")
    .positive("quantidade deve ser maior que zero."),
  custoUnit: z.number().positive("custoUnit deve ser maior que zero."),
});

// Schema para criar compra
export const createCompraSchema = z.object({
  fornecedor: z
    .string()
    .max(150, "Fornecedor não pode exceder 150 caracteres.")
    .optional()
    .nullable(),
  data: z.string().datetime().optional().nullable(),
  descricao: z
    .string()
    .max(1000, "Observação não pode exceder 1000 caracteres.")
    .optional()
    .nullable(),
  itens: z
    .array(itemCompraSchema)
    .min(1, "A compra deve conter pelo menos um item."),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Types
export type CreateCompraInput = z.infer<typeof createCompraSchema>;
export type ItemCompraInput = z.infer<typeof itemCompraSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
