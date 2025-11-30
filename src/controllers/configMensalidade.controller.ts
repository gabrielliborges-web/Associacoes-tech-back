import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as ConfigService from "../services/configMensalidade.service";

export const getConfig = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const associacaoId = req.user?.associacaoId;
    if (!associacaoId)
      return res.status(401).json({ error: "Usuário não autenticado." });

    const config = await ConfigService.getConfigByAssociacao(associacaoId);
    if (!config)
      return res.status(404).json({ error: "Configuração não encontrada." });
    res.status(200).json(config);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Erro ao obter configuração." });
  }
};

export const upsert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const associacaoId = req.user?.associacaoId;
    if (!associacaoId)
      return res.status(401).json({ error: "Usuário não autenticado." });

    const { valorPadrao, diaVencimento, ativo } = req.body;
    if (!valorPadrao || !diaVencimento)
      return res.status(400).json({ error: "Campos inválidos." });

    const created = await ConfigService.upsertConfig(
      associacaoId,
      valorPadrao,
      Number(diaVencimento),
      ativo === undefined ? true : !!ativo
    );
    res.status(200).json(created);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message || "Erro ao salvar configuração." });
  }
};

export default { getConfig, upsert };
