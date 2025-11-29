import { Router } from "express";
import * as AssociadoController from "../controllers/associadoController";

const router = Router();

router.post(
  "/associacoes/:associacaoId/associados",
  AssociadoController.create
);
router.get("/associacoes/:associacaoId/associados", AssociadoController.list);
router.get("/associados/:id", AssociadoController.show);
router.patch("/associados/:id", AssociadoController.update);
router.delete("/associados/:id", AssociadoController.delete_);

export default router;
