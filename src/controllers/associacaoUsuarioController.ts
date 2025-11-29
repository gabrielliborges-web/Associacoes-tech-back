import { Request, Response } from "express";
import { z } from "zod";
import * as VinculoService from "../services/associacaoUsuarioService";
import {
  createVinculoSchema,
  updateVinculoSchema,
} from "../validators/associacaoUsuario.schema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    if (isNaN(associacaoId)) {
      res.status(400).json({ error: "ID da associação inválido." });
      return;
    }
    const parsed = createVinculoSchema.parse(req.body);
    const vinculo = await VinculoService.createVinculo(associacaoId, parsed);
    res.status(201).json(vinculo);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao criar vínculo." });
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    if (isNaN(associacaoId)) {
      res.status(400).json({ error: "ID da associação inválido." });
      return;
    }
    const vinculos = await VinculoService.listVinculos(associacaoId);
    res.status(200).json(vinculos);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao listar vínculos." });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    const usuarioId = Number(req.params.usuarioId);
    if (isNaN(associacaoId) || isNaN(usuarioId)) {
      res.status(400).json({ error: "IDs inválidos." });
      return;
    }
    const parsed = updateVinculoSchema.parse(req.body);
    const vinculo = await VinculoService.updateVinculo(
      associacaoId,
      usuarioId,
      parsed
    );
    res.status(200).json(vinculo);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao atualizar vínculo." });
  }
};

export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    const usuarioId = Number(req.params.usuarioId);
    if (isNaN(associacaoId) || isNaN(usuarioId)) {
      res.status(400).json({ error: "IDs inválidos." });
      return;
    }
    const result = await VinculoService.deleteVinculo(associacaoId, usuarioId);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao remover vínculo." });
  }
};
