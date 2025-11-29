// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    nome: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  console.log("HEADER RECEBIDO:", req.headers.authorization);

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      nome: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido." });
    return;
  }
};
