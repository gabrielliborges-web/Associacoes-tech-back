import { Router } from "express";
import * as UsuarioController from "../controllers/usuarioController";

const router = Router();

router.post("/", UsuarioController.create);
router.get("/", UsuarioController.list);
router.get("/:id", UsuarioController.show);
router.patch("/:id", UsuarioController.update);
router.delete("/:id", UsuarioController.delete_);

export default router;
