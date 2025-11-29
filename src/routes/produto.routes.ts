import { Router } from "express";
import * as ProdutoController from "../controllers/produto.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/multer/multerConfig";

const router = Router();

router.use(requireAuth);

router.get("/", ProdutoController.list);

router.put("/:id/status", ProdutoController.updateStatus);

router.get("/:id", ProdutoController.show);

router.post("/", upload.single("imagem"), ProdutoController.create);

router.put("/:id", upload.single("imagem"), ProdutoController.update);

router.delete("/:id", ProdutoController.delete_);

export default router;
