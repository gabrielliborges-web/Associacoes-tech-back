import { Router } from "express";
import * as AssociadoController from "../controllers/associadoController";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAssociacaoManager } from "../middlewares/roles.middleware";
import { upload } from "../config/multer/multerConfig";

const router = Router();

router.post(
  "/:associacaoId/associados",
  requireAuth,
  requireAssociacaoManager,
  upload.single("foto"),
  AssociadoController.create
);
router.get("/:associacaoId/associados", requireAuth, AssociadoController.list);
router.get("/associados/:id", requireAuth, AssociadoController.show);
router.patch(
  "/associados/:id",
  requireAuth,
  requireAssociacaoManager,
  upload.single("foto"),
  AssociadoController.update
);
router.delete(
  "/associados/:id",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.delete_
);
router.get("/:id", requireAuth, AssociadoController.show);
router.patch(
  "/:id",
  requireAuth,
  requireAssociacaoManager,
  upload.single("foto"),
  AssociadoController.update
);
router.delete(
  "/:id",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.delete_
);

// rota para remoção permanente
router.delete(
  "/:id/permanent",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.deletePermanent
);

router.patch(
  "/:id/activate",
  requireAuth,
  requireAssociacaoManager,
  AssociadoController.activate
);

export default router;
