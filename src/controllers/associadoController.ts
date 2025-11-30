import { Request, Response } from "express";
import { z } from "zod";
import * as AssociadoService from "../services/associadoService";
import {
  createAssociadoSchema,
  updateAssociadoSchema,
} from "../validators/associado.schema";
import { uploadFileToS3, safeFileKey } from "../config/awsConfig";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    if (isNaN(associacaoId)) {
      res.status(400).json({ error: "ID da associação inválido." });
      return;
    }
    const parsed = createAssociadoSchema.parse(req.body);
    let fotoUrl: string | undefined = "";
    if (req.file) {
      const key = safeFileKey(
        undefined,
        parsed.nome,
        "cover",
        req.file.originalname
      );
      const url = await uploadFileToS3(req.file, key);
      fotoUrl = url || undefined;
    }
    const associado = await AssociadoService.createAssociado(associacaoId, {
      ...parsed,
      fotoUrl,
    });
    res.status(201).json(associado);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao criar associado." });
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const associacaoId = Number(req.params.associacaoId);
    if (isNaN(associacaoId)) {
      res.status(400).json({ error: "ID da associação inválido." });
      return;
    }
    const associados = await AssociadoService.listAssociados(associacaoId);
    res.status(200).json(associados);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao listar associados." });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const associado = await AssociadoService.getAssociadoById(id);
    res.status(200).json(associado);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao obter associado." });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const parsed = updateAssociadoSchema.parse(req.body);
    let fotoUrl: string | undefined = parsed.fotoUrl;
    if (req.file) {
      const key = safeFileKey(
        undefined,
        parsed.nome || "associado",
        "cover",
        req.file.originalname
      );
      const url = await uploadFileToS3(req.file, key);
      fotoUrl = url || undefined;
    }
    const associado = await AssociadoService.updateAssociado(id, {
      ...parsed,
      fotoUrl,
    });
    res.status(200).json(associado);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao atualizar associado." });
  }
};

export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const result = await AssociadoService.deactivateAssociado(id);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao desativar associado." });
  }
};

export const deletePermanent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const result = await AssociadoService.deleteAssociado(id);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao excluir associado." });
  }
};

export const activate = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const result = await AssociadoService.activateAssociado(id);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao ativar associado." });
  }
};
