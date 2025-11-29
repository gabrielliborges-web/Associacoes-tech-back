import { Router } from "express";
import * as PasswordResetController from "../controllers/passwordReset.controller";

const router = Router();

router.post("/send", PasswordResetController.sendResetCode);
router.get("/validate", PasswordResetController.validateCode);
router.post("/reset", PasswordResetController.resetPassword);

export default router;
