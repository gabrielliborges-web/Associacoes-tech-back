import { z } from "zod";

// Schema para criar categoria
export const createCategoriaSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres.")
    .max(100, "O nome da categoria não pode exceder 100 caracteres.")
    .trim(),
  descricao: z
    .string()
    .max(500, "A descrição não pode exceder 500 caracteres.")
    .trim()
    .optional()
    .nullable(),
  ativo: z.boolean().optional().default(true),
});

// Schema para atualizar categoria
export const updateCategoriaSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres.")
    .max(100, "O nome da categoria não pode exceder 100 caracteres.")
    .trim()
    .optional(),
  descricao: z
    .string()
    .max(500, "A descrição não pode exceder 500 caracteres.")
    .trim()
    .optional()
    .nullable(),
  ativo: z.boolean().optional(),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Types
export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
