import { z } from "zod";

// Schema para criar produto
export const createProdutoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres.")
    .max(150, "O nome do produto não pode exceder 150 caracteres.")
    .trim(),
  descricao: z
    .string()
    .max(1000, "A descrição não pode exceder 1000 caracteres.")
    .trim()
    .optional()
    .nullable(),
  categoriaId: z
    .number()
    .int("categoriaId deve ser um número inteiro.")
    .positive("categoriaId deve ser um número positivo.")
    .optional()
    .nullable(),
  precoVenda: z.number().positive("O preço de venda deve ser maior que zero."),
  precoCompra: z
    .number()
    .positive("O preço de compra deve ser maior que zero.")
    .optional()
    .nullable(),
  precoPromocional: z
    .number()
    .positive("O preço promocional deve ser maior que zero.")
    .optional()
    .nullable(),
  estoqueInicial: z
    .number()
    .int("estoqueInicial deve ser um número inteiro.")
    .nonnegative("estoqueInicial não pode ser negativo.")
    .optional()
    .default(0),
});

// Schema para atualizar produto (sem estoque)
export const updateProdutoSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres.")
    .max(150, "O nome do produto não pode exceder 150 caracteres.")
    .trim()
    .optional(),
  descricao: z
    .string()
    .max(1000, "A descrição não pode exceder 1000 caracteres.")
    .trim()
    .optional()
    .nullable(),
  categoriaId: z
    .number()
    .int("categoriaId deve ser um número inteiro.")
    .positive("categoriaId deve ser um número positivo.")
    .optional()
    .nullable(),
  precoVenda: z
    .number()
    .positive("O preço de venda deve ser maior que zero.")
    .optional(),
  precoCompra: z
    .number()
    .positive("O preço de compra deve ser maior que zero.")
    .optional()
    .nullable(),
  precoPromocional: z
    .number()
    .positive("O preço promocional deve ser maior que zero.")
    .optional()
    .nullable(),
});

// Schema para alterar status
export const changeStatusSchema = z.object({
  ativo: z.boolean(),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Schema para filtros de listagem
export const filtroListagemSchema = z.object({
  nome: z.string().optional(),
  categoriaId: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  ativo: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

// Types
export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type FiltroListagemInput = z.infer<typeof filtroListagemSchema>;
