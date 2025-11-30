import { Router } from "express";
import * as MensController from "../controllers/mensalidades.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAssociacaoManager } from "../middlewares/roles.middleware";

const router = Router();

// Gera mensalidades do ano para toda a associação
router.post("/gerar-ano", requireAuth, MensController.gerarAno);

// Lista minhas mensalidades
router.get("/me", requireAuth, MensController.listarMe);

// Lista mensalidades de um usuário (admin da associação)
router.get(
  "/usuario/:usuarioId",
  requireAuth,
  requireAssociacaoManager,
  MensController.listarUsuario
);

// Marca mensalidade como paga
router.put("/:id/pagar", requireAuth, MensController.pagar);

export default router;
