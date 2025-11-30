import { z } from "zod";

export const createAssociadoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  apelido: z.string().optional(),
  dataNascimento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido."),
  fotoUrl: z
    .string()
    .url("URL inválida.")
    .or(z.literal("")) // aceita ""
    .optional(),
  numeroCamisaPadrao: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? val : n;
  }, z.number().int().optional()),
  posicaoPreferida: z
    .enum(["GOLEIRO", "ZAGUEIRO", "LATERAL", "VOLANTE", "MEIA", "ATACANTE"])
    .optional(),
  pernaDominante: z.enum(["DIREITA", "ESQUERDA", "AMBIDESTRO"]).optional(),
  ativo: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const v = val.toLowerCase();
      if (v === "true") return true;
      if (v === "false") return false;
    }
    return val;
  }, z.boolean().optional().default(true)),
  observacoes: z.string().optional(),
});

export const updateAssociadoSchema = createAssociadoSchema.partial();

export type CreateAssociadoInput = z.infer<typeof createAssociadoSchema>;
export type UpdateAssociadoInput = z.infer<typeof updateAssociadoSchema>;
