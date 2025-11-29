import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as MovimentacaoService from "../services/movimentacao.service";
import { z } from "zod";
import { idParamSchema, ajusteSchema } from "../validators/movimentacao.schema";

/**
 * Lista todas as movimentações financeiras do usuário com filtros opcionais
 */
export const list = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { dataInicio, dataFim, tipo, entrada } = req.query;

    const filtros = {
      ...(dataInicio && { dataInicio: new Date(dataInicio as string) }),
      ...(dataFim && { dataFim: new Date(dataFim as string) }),
      ...(tipo && { tipo: tipo as string }),
      ...(entrada && {
        entrada:
          entrada === "true" ? true : entrada === "false" ? false : undefined,
      }),
      usuarioId: req.user?.id,
    };

    const movimentacoes = await MovimentacaoService.listMovimentacoes(filtros);
    res.status(200).json(movimentacoes);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar movimentações financeiras.",
    });
  }
};

/**
 * Obtém uma movimentação financeira específica
 */
export const show = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const movimentacao = await MovimentacaoService.getById(Number(id));
    res.status(200).json(movimentacao);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter movimentação financeira.",
    });
  }
};

/**
 * Retorna resumo para dashboard financeiro
 */
export const dashboardResumo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const resumo = await MovimentacaoService.getDashboardResumo(usuarioId);
    res.status(200).json(resumo);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter resumo do dashboard.",
    });
  }
};

/**
 * Retorna o saldo atual do usuário
 */
export const saldoAtual = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const saldo = await MovimentacaoService.getSaldoAtual(usuarioId);
    res.status(200).json({
      saldoAtual: saldo,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter saldo atual.",
    });
  }
};

/**
 * Registra uma movimentação de ajuste manual
 */
export const registrarAjuste = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const dadosValidados = ajusteSchema.parse(req.body);
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({
        message: "Usuário não autenticado.",
      });
      return;
    }

    const ajuste = await MovimentacaoService.registrarAjuste(
      dadosValidados,
      usuarioId
    );
    res.status(201).json(ajuste);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao registrar ajuste.",
    });
  }
};
