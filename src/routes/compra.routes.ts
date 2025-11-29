import { Router } from "express";
import * as CompraController from "../controllers/compra.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Listar compras
router.get("/", CompraController.list);

// Obter compra por ID
router.get("/:id", CompraController.show);

// Criar compra
router.post("/", CompraController.create);

// Deletar compra
router.delete("/:id", CompraController.delete_);

export default router;
