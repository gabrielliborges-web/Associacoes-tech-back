import { Request, Response } from "express";
import * as PasswordResetService from "../services/passwordReset.service";
import { z } from "zod";
import {
  sendResetCodeSchema,
  validateCodeSchema,
  resetPasswordSchema,
} from "../validators/auth.schema";

export const sendResetCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = sendResetCodeSchema.parse(req.body);
    const result = await PasswordResetService.sendResetCode(parsed.email);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const validateCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = validateCodeSchema.parse(req.query);
    const result = await PasswordResetService.validateResetCode(
      parsed.email,
      parsed.code
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);
    const result = await PasswordResetService.resetPassword(
      parsed.email,
      parsed.code,
      parsed.newPassword
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
