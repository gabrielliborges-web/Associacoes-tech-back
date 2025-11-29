import { Router } from "express";
import * as VinculoController from "../controllers/associacaoUsuarioController";

const router = Router({ mergeParams: true });

router.post("/usuarios", VinculoController.create);
router.get("/usuarios", VinculoController.list);
router.patch("/usuarios/:usuarioId", VinculoController.update);
router.delete("/usuarios/:usuarioId", VinculoController.delete_);

export default router;
