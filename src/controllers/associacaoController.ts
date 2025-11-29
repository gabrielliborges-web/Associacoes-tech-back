import { Request, Response } from "express";
import { z } from "zod";
import * as AssociacaoService from "../services/associacaoService";
import {
  createAssociacaoSchema,
  updateAssociacaoSchema,
} from "../validators/associacao.schema";

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const ativa = req.query.ativa as string | undefined;
    const associacoes = await AssociacaoService.listAssociacoes(
      ativa !== undefined ? ativa === "true" : undefined
    );
    res.status(200).json(associacoes);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao listar associações." });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const associacao = await AssociacaoService.getAssociacaoById(id);
    res.status(200).json(associacao);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao obter associação." });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createAssociacaoSchema.parse(req.body);
    const associacao = await AssociacaoService.createAssociacao(parsed);
    res.status(201).json(associacao);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao criar associação." });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const parsed = updateAssociacaoSchema.parse(req.body);
    const associacao = await AssociacaoService.updateAssociacao(id, parsed);
    res.status(200).json(associacao);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao atualizar associação." });
  }
};

export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const result = await AssociacaoService.deactivateAssociacao(id);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao desativar associação." });
  }
};
