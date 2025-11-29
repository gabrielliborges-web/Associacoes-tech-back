import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as MovimentacaoController from "../controllers/movimentacao.controller";

const router = Router();

/**
 * GET /movimentacoes
 * Lista todas as movimentações financeiras (extrato completo)
 */
router.get("/", requireAuth, MovimentacaoController.list);

/**
 * GET /movimentacoes/saldo-atual
 * Retorna apenas o saldo atual
 */
router.get("/saldo-atual", requireAuth, MovimentacaoController.saldoAtual);

/**
 * GET /movimentacoes/dashboard/resumo
 * Retorna resumo para dashboard financeiro
 */
router.get(
  "/dashboard/resumo",
  requireAuth,
  MovimentacaoController.dashboardResumo
);

/**
 * GET /movimentacoes/:id
 * Obtém uma movimentação financeira específica
 */
router.get("/:id", requireAuth, MovimentacaoController.show);

/**
 * POST /movimentacoes/ajuste
 * Registra uma movimentação de ajuste manual
 */
router.post("/ajuste", requireAuth, MovimentacaoController.registrarAjuste);

export default router;
