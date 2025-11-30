import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as MensService from "../services/mensalidadesService";

export const gerarAno = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ano } = req.body;
    const associacaoId = req.user?.associacaoId;
    if (!associacaoId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }
    if (!ano || typeof ano !== "number") {
      res.status(400).json({ error: "Ano inválido." });
      return;
    }

    await MensService.gerarMensalidadesAno(associacaoId, ano);
    res.status(200).json({ message: "Mensalidades geradas para o ano", ano });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const listarMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ano = Number(req.query.ano) || new Date().getFullYear();
    const associacaoId = req.user?.associacaoId;
    const usuarioId = req.user?.id;
    if (!associacaoId || !usuarioId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const mensalidades = await MensService.listarMensalidadesUsuario(
      associacaoId,
      usuarioId,
      ano
    );

    res.status(200).json(mensalidades);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const listarUsuario = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const ano = Number(req.query.ano) || new Date().getFullYear();
    const associacaoId = req.user?.associacaoId;

    if (!associacaoId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const mensalidades = await MensService.listarMensalidadesUsuarioAdmin(
      associacaoId,
      usuarioId,
      ano
    );

    res.status(200).json(mensalidades);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const listarAssociacao = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const associacaoId = req.user?.associacaoId;
    if (!associacaoId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }
    const ano = Number(req.query.ano) || new Date().getFullYear();
    const mensalidades = await MensService.listarMensalidadesAssociacao(
      associacaoId,
      ano
    );
    res.status(200).json(mensalidades);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const pagar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const associacaoId = req.user?.associacaoId;
    if (!associacaoId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const payload = req.body;

    const updated = await MensService.pagarMensalidade(
      id,
      associacaoId,
      payload
    );
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export default { gerarAno, listarMe, listarUsuario, listarAssociacao, pagar };
