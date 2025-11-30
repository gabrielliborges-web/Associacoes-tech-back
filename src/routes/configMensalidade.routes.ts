import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as ConfigController from "../controllers/configMensalidade.controller";

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get("/", requireAuth, asyncHandler(ConfigController.getConfig));
router.post("/", requireAuth, asyncHandler(ConfigController.upsert));

export default router;
