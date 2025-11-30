import { Router } from "express";
import * as AssociadoController from "../controllers/associadoController";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAssociacaoManager } from "../middlewares/roles.middleware";

const router = Router();

router.post(
  "/associacoes/:associacaoId/associados",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.create
);
router.get(
  "/associacoes/:associacaoId/associados",
  requireAuth,
  AssociadoController.list
);
router.get("/associados/:id", requireAuth, AssociadoController.show);
router.patch(
  "/associados/:id",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.update
);
router.delete(
  "/associados/:id",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.delete_
);

export default router;
