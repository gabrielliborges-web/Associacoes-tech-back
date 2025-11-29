import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as UserService from "../services/user.service";
import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  updateThemeSchema,
  updatePasswordSchema,
  idParamSchema,
} from "../validators/user.schema";

/**
 * Lista todos os usuários
 */
export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await UserService.listUsers();
    res.status(200).json(usuarios);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao listar usuários.",
    });
  }
};

/**
 * Obtém um usuário específico
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const usuario = await UserService.getUserById(Number(id));
    res.status(200).json(usuario);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao obter usuário.",
    });
  }
};

/**
 * Cria um novo usuário
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const usuario = await UserService.createUser(parsed);
    res.status(201).json(usuario);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao criar usuário.",
    });
  }
};

/**
 * Atualiza um usuário
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const parsed = updateUserSchema.parse(req.body);
    const usuario = await UserService.updateUser(Number(id), parsed);
    res.status(200).json(usuario);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao atualizar usuário.",
    });
  }
};

/**
 * Atualiza o tema do usuário autenticado
 */
export const updateTheme = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const parsed = updateThemeSchema.parse(req.body);
    const usuario = await UserService.updateTheme(userId, parsed.theme);
    res.status(200).json({
      message: "Tema atualizado com sucesso.",
      user: usuario,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao atualizar tema.",
    });
  }
};

/**
 * Atualiza a senha do usuário autenticado
 */
export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const parsed = updatePasswordSchema.parse(req.body);
    const result = await UserService.updatePassword(userId, parsed);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao atualizar senha.",
    });
  }
};

/**
 * Deleta um usuário
 */
export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const result = await UserService.deleteUser(Number(id));
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao deletar usuário.",
    });
  }
};

/**
 * Obtém o perfil do usuário autenticado
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const result = await UserService.getProfile(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao obter perfil.",
    });
  }
};
