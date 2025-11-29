import { Request, Response } from "express";
import { DespesaService } from "../services/despesa.service";
import {
  createDespesaSchema,
  updateDespesaSchema,
  idParamSchema,
  filtrosListagemSchema,
} from "../validators/despesa.schema";

export class DespesaController {
  /**
   * GET /despesas
   * Lista todas as despesas do usuário com filtros opcionais
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      // Validar query params com filtros
      const filtros = filtrosListagemSchema.parse(req.query);

      // Converter datas se fornecidas
      const filters: any = {};
      if (filtros.tipo) filters.tipo = filtros.tipo;
      if (filtros.dataInicio) filters.dataInicio = new Date(filtros.dataInicio);
      if (filtros.dataFim) filters.dataFim = new Date(filtros.dataFim);
      if (filtros.valorMinimo !== undefined)
        filters.valorMinimo = filtros.valorMinimo;
      if (filtros.valorMaximo !== undefined)
        filters.valorMaximo = filtros.valorMaximo;

      const despesas = await DespesaService.listDespesas(userId, filters);

      res.status(200).json(despesas);
    } catch (error: any) {
      if (error.errors && Array.isArray(error.errors)) {
        res.status(400).json({
          message: "Erro de validação.",
          errors: error.errors.map((e: any) => e.message),
        });
        return;
      }

      res.status(500).json({
        message: error.message || "Erro interno do servidor",
      });
    }
  }

  /**
   * GET /despesas/:id
   * Obtém uma despesa específica pelo ID
   */
  static async show(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = idParamSchema.parse(req.params);

      const despesa = await DespesaService.getDespesaById(id, userId);

      res.status(200).json(despesa);
    } catch (error: any) {
      if (error.statusCode === 404) {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.statusCode === 403) {
        res.status(403).json({
          message: error.message,
        });
        return;
      }

      if (error.errors && Array.isArray(error.errors)) {
        res.status(400).json({
          message: "Erro de validação.",
          errors: error.errors.map((e: any) => e.message),
        });
        return;
      }

      res.status(500).json({
        message: error.message || "Erro interno do servidor",
      });
    }
  }

  /**
   * POST /despesas
   * Cria uma nova despesa
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const dto = createDespesaSchema.parse(req.body);

      const despesa = await DespesaService.createDespesa(dto, userId);

      res.status(201).json(despesa);
    } catch (error: any) {
      // Erro enviado manualmente pelo service
      if (error.statusCode) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      // Erros do Zod
      if (error.errors) {
        res.status(400).json({
          message: "Erro de validação",
          errors: error.errors.map((e: any) => e.message),
        });
        return;
      }

      res.status(500).json({
        message: error.message || "Erro interno do servidor",
      });
    }
  }

  /**
   * PUT /despesas/:id
   * Atualiza uma despesa existente
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = idParamSchema.parse(req.params);
      const dto = updateDespesaSchema.parse(req.body);

      const despesaAtualizada = await DespesaService.updateDespesa(
        id,
        dto,
        userId
      );

      res.status(200).json(despesaAtualizada);
    } catch (error: any) {
      if (error.statusCode === 404) {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.statusCode === 403) {
        res.status(403).json({
          message: error.message,
        });
        return;
      }

      if (error.statusCode === 400) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      if (error.errors && Array.isArray(error.errors)) {
        res.status(400).json({
          message: "Erro de validação.",
          errors: error.errors.map((e: any) => e.message),
        });
        return;
      }

      res.status(500).json({
        message: error.message || "Erro interno do servidor",
      });
    }
  }

  /**
   * DELETE /despesas/:id
   * Deleta uma despesa
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = idParamSchema.parse(req.params);

      const result = await DespesaService.deleteDespesa(id, userId);

      res.status(200).json(result);
    } catch (error: any) {
      if (error.statusCode === 404) {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.statusCode === 403) {
        res.status(403).json({
          message: error.message,
        });
        return;
      }

      if (error.errors && Array.isArray(error.errors)) {
        res.status(400).json({
          message: "Erro de validação.",
          errors: error.errors.map((e: any) => e.message),
        });
        return;
      }

      res.status(500).json({
        message: error.message || "Erro interno do servidor",
      });
    }
  }
}
