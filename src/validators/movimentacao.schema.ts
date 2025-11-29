import { z } from "zod";

// Schema para listar movimentações (query params)
export const listMovimentacoesSchema = z.object({
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  tipo: z.string().optional(),
  usuarioId: z.number().optional(),
  entrada: z.enum(["true", "false"]).optional(),
});

// Schema para ID de parâmetro
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ID deve ser um número válido e positivo.",
  }),
});

// Schema para registrar ajuste
export const ajusteSchema = z.object({
  descricao: z
    .string()
    .min(3, "Descrição deve ter no mínimo 3 caracteres.")
    .max(500, "Descrição não pode exceder 500 caracteres."),
  valor: z.number().positive("Valor deve ser maior que zero."),
  entrada: z
    .boolean()
    .describe("Entrada é obrigatório (true para entrada, false para saída)."),
});

// Types
export type ListMovimentacoesInput = z.infer<typeof listMovimentacoesSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type CreateAjusteInput = z.infer<typeof ajusteSchema>;
