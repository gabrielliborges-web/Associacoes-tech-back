import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as EntradaFinanceiraService from "../services/entradaFinanceira.service";
import { z } from "zod";
import {
  createEntradaFinanceiraSchema,
  updateEntradaFinanceiraSchema,
  idParamSchema,
} from "../validators/entradaFinanceira.schema";

/**
 * Lista todas as entradas financeiras do usuário com filtros opcionais
 */
export const list = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { dataInicio, dataFim, tipo } = req.query;

    const filtros = {
      ...(dataInicio && { dataInicio: new Date(dataInicio as string) }),
      ...(dataFim && { dataFim: new Date(dataFim as string) }),
      ...(tipo && { tipo: tipo as string }),
      usuarioId: req.user?.id,
    };

    const entradas = await EntradaFinanceiraService.listEntradas(filtros);
    res.status(200).json(entradas);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar entradas financeiras.",
    });
  }
};

/**
 * Obtém uma entrada financeira específica
 */
export const show = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const entrada = await EntradaFinanceiraService.getEntradaById(Number(id));
    res.status(200).json(entrada);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter entrada financeira.",
    });
  }
};

/**
 * Cria uma nova entrada financeira
 */
export const create = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const dadosValidados = createEntradaFinanceiraSchema.parse(req.body);
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const entrada = await EntradaFinanceiraService.createEntrada(
      dadosValidados,
      usuarioId
    );
    res.status(201).json(entrada);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar entrada financeira.",
    });
  }
};

/**
 * Atualiza uma entrada financeira existente
 */
export const update = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const dadosValidados = updateEntradaFinanceiraSchema.parse(req.body);
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const entrada = await EntradaFinanceiraService.updateEntrada(
      Number(id),
      dadosValidados,
      usuarioId
    );
    res.status(200).json(entrada);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar entrada financeira.",
    });
  }
};

/**
 * Deleta uma entrada financeira existente
 */
export const delete_ = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const entrada = await EntradaFinanceiraService.deleteEntrada(
      Number(id),
      usuarioId
    );
    res.status(200).json({
      message: "Entrada financeira deletada com sucesso.",
      entrada,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao deletar entrada financeira.",
    });
  }
};
