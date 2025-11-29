import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as CompraService from "../services/compra.service";
import { z } from "zod";
import { createCompraSchema, idParamSchema } from "../validators/compra.schema";

/**
 * Lista todas as compras do usuário logado com filtros opcionais
 */
export const list = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { dataInicio, dataFim, fornecedor } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const filtros = {
      ...(dataInicio && { dataInicio: new Date(dataInicio as string) }),
      ...(dataFim && { dataFim: new Date(dataFim as string) }),
      ...(fornecedor && { fornecedor: fornecedor as string }),
    };

    const compras = await CompraService.listCompras(userId, filtros);
    res.status(200).json(compras);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar compras.",
    });
  }
};

/**
 * Obtém uma compra específica com seus itens
 */
export const show = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const compra = await CompraService.getCompraById(Number(id));
    res.status(200).json(compra);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter compra.",
    });
  }
};

/**
 * Cria uma nova compra com itens
 */
export const create = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const parsed = createCompraSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const compra = await CompraService.createCompra(parsed, userId);
    res.status(201).json(compra);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar compra.",
    });
  }
};

/**
 * Deleta uma compra e reverte o estoque
 */
export const delete_ = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const result = await CompraService.deleteCompra(Number(id), userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao deletar compra.",
    });
  }
};
