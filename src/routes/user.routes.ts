import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/roles.middleware";

const router = Router();

// Rota para perfil do usuário autenticado (antes de :id para evitar conflito)
router.get("/profile", requireAuth, UserController.getProfile);

// Rotas públicas (sem autenticação obrigatória)
router.get("/", UserController.list);
router.get("/:id", UserController.show);

// Rota protegida - apenas admin pode criar usuários
router.post("/", requireAuth, requireAdmin, UserController.create);

// Rotas protegidas (requerem autenticação)
router.put("/:id", requireAuth, UserController.update);
router.put("/:id/theme", requireAuth, UserController.updateTheme);
router.put("/:id/password", requireAuth, UserController.updatePassword);
router.delete("/:id", requireAuth, requireAdmin, UserController.delete_);

export default router;
