import { z } from "zod";

export const createAssociacaoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  apelido: z.string().optional(),
  descricao: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  logoUrl: z.string().url().optional(),
  ativa: z.boolean().optional().default(true),
  regrasInternas: z.string().optional(),
  horarioPadraoInicio: z.string().optional(),
  horarioPadraoFim: z.string().optional(),
  tipoJogoPadrao: z
    .enum(["BABA", "AMISTOSO", "CAMPEONATO", "TREINO"])
    .optional(),
});

export const updateAssociacaoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório.").optional(),
  apelido: z.string().optional(),
  descricao: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  logoUrl: z.string().url().optional(),
  ativa: z.boolean().optional(),
  regrasInternas: z.string().optional(),
  horarioPadraoInicio: z.string().optional(),
  horarioPadraoFim: z.string().optional(),
  tipoJogoPadrao: z
    .enum(["BABA", "AMISTOSO", "CAMPEONATO", "TREINO"])
    .optional(),
});

export type CreateAssociacaoInput = z.infer<typeof createAssociacaoSchema>;
export type UpdateAssociacaoInput = z.infer<typeof updateAssociacaoSchema>;
