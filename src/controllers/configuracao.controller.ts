import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as ConfiguracaoService from "../services/configuracao.service";
import { z } from "zod";
import { updateConfiguracaoSchema } from "../validators/configuracao.schema";

/**
 * Obtém as configurações atuais
 */
export const get = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const configuracao = await ConfiguracaoService.getConfiguracao();
    res.status(200).json(configuracao);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter configurações.",
    });
  }
};

/**
 * Atualiza as configurações (saldo inicial e/ou mês atual)
 */
export const update = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const dadosValidados = updateConfiguracaoSchema.parse(req.body);

    const configuracao = await ConfiguracaoService.updateConfiguracao(
      dadosValidados
    );
    res.status(200).json(configuracao);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar configurações.",
    });
  }
};
