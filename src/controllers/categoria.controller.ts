import { Request, Response } from "express";
import * as CategoriaService from "../services/categoria.service";
import { z } from "zod";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  idParamSchema,
} from "../validators/categoria.schema";

/**
 * Lista todas as categorias
 */
export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await CategoriaService.listCategorias();
    res.status(200).json(categorias);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar categorias.",
    });
  }
};

/**
 * Obtém uma categoria específica
 */
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const categoria = await CategoriaService.getCategoriaById(Number(id));
    res.status(200).json(categoria);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter categoria.",
    });
  }
};

/**
 * Cria uma nova categoria
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createCategoriaSchema.parse(req.body);
    const categoria = await CategoriaService.createCategoria(parsed);
    res.status(201).json(categoria);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar categoria.",
    });
  }
};

/**
 * Atualiza uma categoria
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const parsed = updateCategoriaSchema.parse(req.body);
    const categoria = await CategoriaService.updateCategoria(
      Number(id),
      parsed
    );
    res.status(200).json(categoria);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar categoria.",
    });
  }
};

/**
 * Deleta uma categoria
 */
export const delete_ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const result = await CategoriaService.deleteCategoria(Number(id));
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao deletar categoria.",
    });
  }
};
