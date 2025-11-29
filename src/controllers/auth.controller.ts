import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { z } from "zod";
import {
  signupSchema,
  loginSchema,
  signupPrimeiroUsuarioSchema,
} from "../validators/auth.schema";

export const signupPrimeiroUsuario = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = signupPrimeiroUsuarioSchema.parse(req.body);

    const result = await AuthService.signupPrimeiroUsuario(parsed);

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao criar associação e usuário.",
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = signupSchema.parse(req.body);

    const result = await AuthService.signup(parsed);

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao criar conta.",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);

    const result = await AuthService.login(parsed);

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      error: error.message || "Erro ao fazer login.",
    });
  }
};
