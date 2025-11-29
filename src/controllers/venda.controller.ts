import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as VendaService from "../services/venda.service";
import { z } from "zod";
import { createVendaSchema, idParamSchema } from "../validators/venda.schema";

/**
 * Lista todas as vendas do usuário com filtros opcionais
 */
export const list = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { dataInicio, dataFim, formaPagamento } = req.query;

    const filtros = {
      ...(dataInicio && { dataInicio: new Date(dataInicio as string) }),
      ...(dataFim && { dataFim: new Date(dataFim as string) }),
      ...(formaPagamento && { formaPagamento: formaPagamento as string }),
      usuarioId: req.user?.id,
    };

    const vendas = await VendaService.listVendas(filtros);
    res.status(200).json(vendas);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar vendas.",
    });
  }
};

/**
 * Obtém uma venda específica com seus itens
 */
export const show = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const venda = await VendaService.getVendaById(Number(id));
    res.status(200).json(venda);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter venda.",
    });
  }
};

/**
 * Cria uma nova venda com itens
 */
export const create = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const dadosValidados = createVendaSchema.parse(req.body);
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const venda = await VendaService.createVenda(dadosValidados, usuarioId);
    res.status(201).json(venda);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar venda.",
    });
  }
};

/**
 * Cancela uma venda existente
 */
export const cancel = async (
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

    const venda = await VendaService.cancelVenda(Number(id), usuarioId);
    res.status(200).json({
      message: "Venda cancelada e estoque revertido com sucesso.",
      venda,
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
      message: error.message || "Erro ao cancelar venda.",
    });
  }
};
