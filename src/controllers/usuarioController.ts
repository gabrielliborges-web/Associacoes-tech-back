import { Request, Response } from "express";
import * as UsuarioService from "../services/usuarioService";
import { z } from "zod";
import { createUserSchema, updateUserSchema } from "../validators/user.schema";

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const ativoFilter = req.query.ativo as string | undefined;
    const usuarios = await UsuarioService.listUsuarios(
      ativoFilter !== undefined ? ativoFilter === "true" : undefined
    );
    res.status(200).json(usuarios);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao listar usuários." });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const usuario = await UsuarioService.getUsuarioById(id);
    res.status(200).json(usuario);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao obter usuário." });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const usuario = await UsuarioService.createUsuario(parsed);
    res.status(201).json(usuario);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao criar usuário." });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const parsed = updateUserSchema.parse(req.body);
    const usuario = await UsuarioService.updateUsuario(id, parsed);
    res.status(200).json(usuario);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues.map((i) => i.message) });
      return;
    }
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao atualizar usuário." });
  }
};

export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido." });
      return;
    }
    const result = await UsuarioService.deactivateUsuario(id);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Erro ao desativar usuário." });
  }
};
