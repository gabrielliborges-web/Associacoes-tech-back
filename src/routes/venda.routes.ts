import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as VendaController from "../controllers/venda.controller";

const router = Router();

/**
 * GET /vendas
 * Lista todas as vendas com filtros opcionais
 */
router.get("/", requireAuth, VendaController.list);

/**
 * GET /vendas/:id
 * Obtém uma venda específica com seus itens
 */
router.get("/:id", requireAuth, VendaController.show);

/**
 * POST /vendas
 * Cria uma nova venda com itens
 */
router.post("/", requireAuth, VendaController.create);

/**
 * POST /vendas/:id/cancelar
 * Cancela uma venda existente e reverte o estoque
 */
router.post("/:id/cancelar", requireAuth, VendaController.cancel);

export default router;
