import { prisma } from "../config/prisma";
import {
  CreateDespesaInput,
  UpdateDespesaInput,
} from "../validators/despesa.schema";
import { registrar } from "./movimentacao.service";

export class DespesaService {
  /**
   * Lista despesas com filtros opcionais
   */
  static async listDespesas(
    userId: number,
    filters?: {
      tipo?: string;
      dataInicio?: Date;
      dataFim?: Date;
      valorMinimo?: number;
      valorMaximo?: number;
    }
  ) {
    const where: any = { usuarioId: userId };

    if (filters?.tipo) {
      where.tipo = { contains: filters.tipo, mode: "insensitive" };
    }

    if (filters?.dataInicio || filters?.dataFim) {
      where.data = {};
      if (filters.dataInicio) {
        where.data.gte = filters.dataInicio;
      }
      if (filters.dataFim) {
        where.data.lte = filters.dataFim;
      }
    }

    if (
      filters?.valorMinimo !== undefined ||
      filters?.valorMaximo !== undefined
    ) {
      where.valor = {};
      if (filters.valorMinimo !== undefined) {
        where.valor.gte = filters.valorMinimo;
      }
      if (filters.valorMaximo !== undefined) {
        where.valor.lte = filters.valorMaximo;
      }
    }

    const despesas = await prisma.despesa.findMany({
      where,
      orderBy: { data: "desc" },
    });

    return despesas.map((despesa) => ({
      id: despesa.id,
      tipo: despesa.tipo,
      descricao: despesa.descricao,
      valor: Number(despesa.valor),
      observacao: despesa.observacao,
      data: despesa.data,
      criadoEm: despesa.criadoEm,
    }));
  }

  /**
   * Obtém uma despesa por ID
   */
  static async getDespesaById(id: number, userId: number) {
    const despesa = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesa) {
      const error = new Error("Despesa não encontrada");
      (error as any).statusCode = 404;
      throw error;
    }

    if (despesa.usuarioId !== userId) {
      const error = new Error(
        "Você não tem permissão para acessar esta despesa"
      );
      (error as any).statusCode = 403;
      throw error;
    }

    return {
      id: despesa.id,
      tipo: despesa.tipo,
      descricao: despesa.descricao,
      valor: Number(despesa.valor),
      observacao: despesa.observacao,
      data: despesa.data,
      criadoEm: despesa.criadoEm,
    };
  }

  /**
   * Cria uma despesa e registra movimentação financeira
   */
  static async createDespesa(dto: CreateDespesaInput, userId: number) {
    // Validações
    if (!dto.tipo?.trim()) {
      const error = new Error("O tipo é obrigatório");
      (error as any).statusCode = 400;
      throw error;
    }

    if (!dto.descricao?.trim()) {
      const error = new Error("A descrição é obrigatória");
      (error as any).statusCode = 400;
      throw error;
    }

    if (dto.valor <= 0) {
      const error = new Error("O valor da despesa deve ser maior que zero");
      (error as any).statusCode = 400;
      throw error;
    }

    // Criar despesa
    const despesa = await prisma.despesa.create({
      data: {
        descricao: dto.descricao.trim(),
        tipo: dto.tipo.trim(),
        valor: dto.valor,
        observacao: dto.observacao?.trim(),
        data: dto.data ? new Date(dto.data) : new Date(),
        usuarioId: userId,
      },
    });

    /**
     * REGISTRA A MOVIMENTAÇÃO FINANCEIRA
     * tipo = "despesa"  (você pode padronizar isso depois)
     */
    try {
      await registrar({
        usuarioId: userId,
        tipo: "despesa",
        entrada: false,
        descricao: `Despesa - ${despesa.descricao}`,
        valor: Number(despesa.valor),
        referenciaId: despesa.id,
      });
    } catch (error) {
      console.error(
        "Erro ao registrar movimentação, revertendo despesa:",
        error
      );
      await prisma.despesa.delete({ where: { id: despesa.id } });
      throw error;
    }

    return {
      id: despesa.id,
      tipo: despesa.tipo,
      descricao: despesa.descricao,
      valor: Number(despesa.valor),
      observacao: despesa.observacao,
      data: despesa.data,
      criadoEm: despesa.criadoEm,
    };
  }

  /**
   * Atualiza uma despesa
   */
  static async updateDespesa(
    id: number,
    dto: UpdateDespesaInput,
    userId: number
  ) {
    // Verificar se despesa existe e pertence ao usuário
    const despesaExistente = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesaExistente) {
      const error = new Error("Despesa não encontrada");
      (error as any).statusCode = 404;
      throw error;
    }

    if (despesaExistente.usuarioId !== userId) {
      const error = new Error(
        "Você não tem permissão para atualizar esta despesa"
      );
      (error as any).statusCode = 403;
      throw error;
    }

    // Validações
    if (dto.valor !== undefined && dto.valor <= 0) {
      const error = new Error("O valor da despesa deve ser maior que zero");
      (error as any).statusCode = 400;
      throw error;
    }

    if (
      dto.descricao !== undefined &&
      (!dto.descricao || dto.descricao.trim().length === 0)
    ) {
      const error = new Error("A descrição não pode ser vazia");
      (error as any).statusCode = 400;
      throw error;
    }

    if (dto.tipo !== undefined && (!dto.tipo || dto.tipo.trim().length === 0)) {
      const error = new Error("O tipo não pode ser vazio");
      (error as any).statusCode = 400;
      throw error;
    }

    // Atualizar despesa
    const despesaAtualizada = await prisma.despesa.update({
      where: { id },
      data: {
        descricao: dto.descricao ? dto.descricao.trim() : undefined,
        tipo: dto.tipo ? dto.tipo.trim() : undefined,
        valor: dto.valor,
        observacao: dto.observacao ? dto.observacao.trim() : undefined,
        data: dto.data ? new Date(dto.data) : undefined,
      },
    });

    // Atualizar movimentação financeira relacionada se houver
    try {
      const movimentacao = await prisma.movimentacaoFinanceira.findFirst({
        where: {
          referenciaId: id,
          tipo: "despesa",
        },
      });

      if (movimentacao) {
        await prisma.movimentacaoFinanceira.update({
          where: { id: movimentacao.id },
          data: {
            valor: dto.valor || despesaExistente.valor,
            descricao: `Despesa - ${
              dto.descricao || despesaExistente.descricao
            }`,
            data: dto.data ? new Date(dto.data) : movimentacao.data,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar movimentação financeira:", error);
      // Não falha a operação se movimentação não conseguir atualizar
    }

    return {
      id: despesaAtualizada.id,
      tipo: despesaAtualizada.tipo,
      descricao: despesaAtualizada.descricao,
      valor: Number(despesaAtualizada.valor),
      observacao: despesaAtualizada.observacao,
      data: despesaAtualizada.data,
      criadoEm: despesaAtualizada.criadoEm,
    };
  }

  /**
   * Deleta uma despesa (soft delete com reversão de movimentação)
   */
  static async deleteDespesa(id: number, userId: number) {
    // Verificar se despesa existe e pertence ao usuário
    const despesa = await prisma.despesa.findUnique({
      where: { id },
    });

    if (!despesa) {
      const error = new Error("Despesa não encontrada");
      (error as any).statusCode = 404;
      throw error;
    }

    if (despesa.usuarioId !== userId) {
      const error = new Error(
        "Você não tem permissão para deletar esta despesa"
      );
      (error as any).statusCode = 403;
      throw error;
    }

    // Deletar movimentação financeira relacionada
    try {
      const movimentacao = await prisma.movimentacaoFinanceira.findFirst({
        where: {
          referenciaId: id,
          tipo: "despesa",
        },
      });

      if (movimentacao) {
        await prisma.movimentacaoFinanceira.delete({
          where: { id: movimentacao.id },
        });
      }
    } catch (error) {
      console.error("Erro ao deletar movimentação financeira:", error);
      // Não falha a operação se movimentação não conseguir deletar
    }

    // Deletar despesa
    await prisma.despesa.delete({
      where: { id },
    });

    return {
      message: "Despesa deletada com sucesso",
      id,
    };
  }
}
