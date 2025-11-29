import { Router } from "express";
import * as CategoriaController from "../controllers/categoria.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/roles.middleware";

const router = Router();

// Rota pública - listar categorias
router.get("/", CategoriaController.list);

// Rota pública - obter categoria por ID
router.get("/:id", CategoriaController.show);

// Rotas protegidas (requerem autenticação)
// Criar categoria (apenas admin)
router.post("/", requireAuth, requireAdmin, CategoriaController.create);

// Atualizar categoria (apenas admin)
router.put("/:id", requireAuth, requireAdmin, CategoriaController.update);

// Deletar categoria (apenas admin)
router.delete("/:id", requireAuth, requireAdmin, CategoriaController.delete_);

export default router;
