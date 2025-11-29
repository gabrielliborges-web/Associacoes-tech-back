import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as EntradaFinanceiraController from "../controllers/entradaFinanceira.controller";

const router = Router();

/**
 * GET /entradas
 * Lista todas as entradas financeiras com filtros opcionais
 */
router.get("/", requireAuth, EntradaFinanceiraController.list);

/**
 * GET /entradas/:id
 * Obtém uma entrada financeira específica com detalhes
 */
router.get("/:id", requireAuth, EntradaFinanceiraController.show);

/**
 * POST /entradas
 * Cria uma nova entrada financeira
 */
router.post("/", requireAuth, EntradaFinanceiraController.create);

/**
 * PUT /entradas/:id
 * Atualiza uma entrada financeira existente
 */
router.put("/:id", requireAuth, EntradaFinanceiraController.update);

/**
 * DELETE /entradas/:id
 * Deleta uma entrada financeira existente
 */
router.delete("/:id", requireAuth, EntradaFinanceiraController.delete_);

export default router;
