import { z } from "zod";

export const createVinculoSchema = z.object({
  usuarioId: z.number().int().positive(),
  perfil: z.enum(["SOCIO", "DIRETOR", "TECNICO", "ADMINISTRADOR"]),
});

export const updateVinculoSchema = z.object({
  perfil: z.enum(["SOCIO", "DIRETOR", "TECNICO", "ADMINISTRADOR"]),
});

export type CreateVinculoInput = z.infer<typeof createVinculoSchema>;
export type UpdateVinculoInput = z.infer<typeof updateVinculoSchema>;
