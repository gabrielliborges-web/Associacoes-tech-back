import { Router } from "express";
import * as AssociacaoController from "../controllers/associacaoController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

import { uploadProdutoImage } from "../middlewares/upload.middleware";

router.get("/minha", requireAuth, AssociacaoController.getMinhaAssociacao);
router.put(
  "/minha",
  requireAuth,
  uploadProdutoImage.single("logo"),
  AssociacaoController.atualizarMinhaAssociacao
);

router.post("/", AssociacaoController.create);
router.get("/", AssociacaoController.list);
router.get("/:id", AssociacaoController.show);
router.patch("/:id", AssociacaoController.update);
router.delete("/:id", AssociacaoController.delete_);

export default router;
