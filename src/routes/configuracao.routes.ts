import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as ConfiguracaoController from "../controllers/configuracao.controller";

const router = Router();

/**
 * GET /config
 * Obtém as configurações atuais
 */
router.get("/", requireAuth, ConfiguracaoController.get);

/**
 * PUT /config
 * Atualiza as configurações
 */
router.put("/", requireAuth, ConfiguracaoController.update);

export default router;
