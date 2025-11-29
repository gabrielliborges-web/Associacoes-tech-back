import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/signup-primeiro-usuario", AuthController.signupPrimeiroUsuario);
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

export default router;
