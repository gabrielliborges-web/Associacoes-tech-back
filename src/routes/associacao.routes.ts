import { Router } from "express";
import * as AssociacaoController from "../controllers/associacaoController";

const router = Router();

router.post("/", AssociacaoController.create);
router.get("/", AssociacaoController.list);
router.get("/:id", AssociacaoController.show);
router.patch("/:id", AssociacaoController.update);
router.delete("/:id", AssociacaoController.delete_);

export default router;
