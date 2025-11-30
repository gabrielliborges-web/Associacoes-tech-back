import { Response, NextFunction } from "express";
// import the correct type from auth.middleware or define it here if missing
// import { AuthenticatedRequest } from "./auth.middleware";
import { Request } from "express";

// If AuthenticatedRequest is not exported from auth.middleware, define it here:
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    nome: string;
    email: string;
    role: string;
    associacaoId?: number;
    perfilAssociacao?: string;
    // add other user properties as needed
  };
}

/**
 * Middleware para verificar se o usuário tem uma role específica
 * @param allowedRoles - Array de roles permitidas
 */
export const checkRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }
    next();

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error: "Acesso negado. Privilégios insuficientes.",
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para verificar se o usuário é ADMIN ou SUPERADMIN
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  if (!["USER", "ADMIN", "SUPERADMIN"].includes(user.role)) {
    res.status(403).json({
      error: "Acesso negado. Privilégios insuficientes.",
    });
    return;
  }

  next();
};

/**
 * Middleware para verificar se o usuário é SUPERADMIN
 */
export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  if (user.role !== "SUPERADMIN") {
    res.status(403).json({
      error: "Acesso negado. Privilégios insuficientes.",
    });
    return;
  }

  next();
};

/**
 * Middleware para verificar se o usuário pode gerenciar associados da associação
 * (ADMINISTRADOR, DIRETOR ou TECNICO)
 */
export const requireAssociacaoManager = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  const allowedPerfis = ["ADMINISTRADOR", "DIRETOR", "TECNICO"];
  console.log("Perfil do usuário:", user.perfilAssociacao);
  if (
    !user.perfilAssociacao ||
    !allowedPerfis.includes(user.perfilAssociacao)
  ) {
    res.status(403).json({
      error:
        "Acesso negado. Apenas administradores, diretores ou técnicos podem gerenciar associados.",
    });
    return;
  }

  next();
};
