// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Augment the express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      nome: string;
      email: string;
      role: string;
      associacaoId?: number;
    };
  }
}

export const requireAuth = (
  req: Request,
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
      associacaoId?: number;
    };

    // Popula req.user com associacaoId se presente no token
    (req as any).user = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      role: decoded.role,
      associacaoId: decoded.associacaoId,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido." });
    return;
  }
};
