import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

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
