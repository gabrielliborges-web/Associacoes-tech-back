import { Router } from "express";
import { DespesaController } from "../controllers/despesa.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * GET /despesas
 * Lista todas as despesas do usuário com filtros opcionais
 */
router.get("/", requireAuth, DespesaController.list);

/**
 * GET /despesas/:id
 * Obtém uma despesa específica
 */
router.get("/:id", requireAuth, DespesaController.show);

/**
 * POST /despesas
 * Cria uma nova despesa
 */
router.post("/", requireAuth, DespesaController.create);

/**
 * PUT /despesas/:id
 * Atualiza uma despesa existente
 */
router.put("/:id", requireAuth, DespesaController.update);

/**
 * DELETE /despesas/:id
 * Deleta uma despesa
 */
router.delete("/:id", requireAuth, DespesaController.delete);

export default router;
