import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as ProdutoService from "../services/produto.service";
import { z } from "zod";
import {
  createProdutoSchema,
  updateProdutoSchema,
  changeStatusSchema,
  idParamSchema,
  filtroListagemSchema,
} from "../validators/produto.schema";

/**
 * Lista todos os produtos com filtros opcionais
 */
export const list = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const filtros = filtroListagemSchema.parse(req.query);

    const produtos = await ProdutoService.listProdutos({
      ...filtros,
      usuarioId: req.user?.id,
    });

    res.status(200).json(produtos);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao listar produtos.",
    });
  }
};

/**
 * Obtém um produto específico
 */
export const show = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const produto = await ProdutoService.getProdutoById(Number(id));
    res.status(200).json(produto);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao obter produto.",
    });
  }
};

/**
 * Cria um novo produto
 */
export const create = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Converter campos numéricos que vêm como strings do multipart/form-data
    const body = {
      ...req.body,
      categoriaId: req.body.categoriaId
        ? Number(req.body.categoriaId)
        : undefined,
      precoVenda: req.body.precoVenda ? Number(req.body.precoVenda) : undefined,
      precoCompra: req.body.precoCompra
        ? Number(req.body.precoCompra)
        : undefined,
      precoPromocional: req.body.precoPromocional
        ? Number(req.body.precoPromocional)
        : undefined,
      estoqueInicial: req.body.estoqueInicial
        ? Number(req.body.estoqueInicial)
        : undefined,
    };

    const parsed = createProdutoSchema.parse(body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const file = (req as any).file;

    const produto = await ProdutoService.createProduto(parsed, file, userId);
    res.status(201).json(produto);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
          code: i.code,
        })),
      });
      return;
    }

    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar produto.",
    });
  }
};

/**
 * Atualiza um produto
 */
export const update = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);

    // Converter campos numéricos que vêm como strings do multipart/form-data
    const body = {
      ...req.body,
      categoriaId: req.body.categoriaId
        ? Number(req.body.categoriaId)
        : undefined,
      precoVenda: req.body.precoVenda ? Number(req.body.precoVenda) : undefined,
      precoCompra: req.body.precoCompra
        ? Number(req.body.precoCompra)
        : undefined,
      precoPromocional: req.body.precoPromocional
        ? Number(req.body.precoPromocional)
        : undefined,
    };

    const parsed = updateProdutoSchema.parse(body);
    const file = (req as any).file;

    const produto = await ProdutoService.updateProduto(
      Number(id),
      parsed,
      file
    );
    res.status(200).json(produto);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
          code: i.code,
        })),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar produto.",
    });
  }
};

/**
 * Atualiza o status de um produto
 */
export const updateStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const parsed = changeStatusSchema.parse(req.body);

    const produto = await ProdutoService.updateProdutoStatus(
      Number(id),
      parsed.ativo
    );
    res.status(200).json(produto);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Erro de validação.",
        errors: error.issues.map((i) => i.message),
      });
      return;
    }
    res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao atualizar status do produto.",
    });
  }
};

/**
 * Deleta um produto
 */
export const delete_ = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params);
    const result = await ProdutoService.deleteProduto(Number(id));
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
      message: error.message || "Erro ao deletar produto.",
    });
  }
};
