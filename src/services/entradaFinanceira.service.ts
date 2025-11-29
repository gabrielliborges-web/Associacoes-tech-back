import { prisma } from "../config/prisma";
import {
  CreateEntradaFinanceiraInput,
  UpdateEntradaFinanceiraInput,
} from "../validators/entradaFinanceira.schema";

interface EntradaFilters {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: string;
  usuarioId?: number;
}

/**
 * Lista todas as entradas financeiras com filtros opcionais
 */
export const listEntradas = async (filters?: EntradaFilters) => {
  const entradas = await prisma.entradaFinanceira.findMany({
    where: {
      ...(filters?.dataInicio && {
        data: {
          gte: filters.dataInicio,
        },
      }),
      ...(filters?.dataFim && {
        data: {
          lte: filters.dataFim,
        },
      }),
      ...(filters?.tipo && {
        tipo: {
          contains: filters.tipo,
          mode: "insensitive",
        },
      }),
      ...(filters?.usuarioId && { usuarioId: filters.usuarioId }),
    },
    select: {
      id: true,
      tipo: true,
      valor: true,
      data: true,
      observacao: true,
      usuarioId: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      criadoEm: true,
    },
    orderBy: {
      data: "desc",
    },
  });

  return entradas;
};

/**
 * Obtém uma entrada financeira específica com detalhes
 */
export const getEntradaById = async (id: number) => {
  const entrada = await prisma.entradaFinanceira.findUnique({
    where: { id },
    select: {
      id: true,
      tipo: true,
      valor: true,
      data: true,
      observacao: true,
      usuarioId: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      criadoEm: true,
    },
  });

  if (!entrada) {
    const error = new Error("Entrada financeira não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  return entrada;
};

/**
 * Cria uma nova entrada financeira e registra a movimentação
 */
export const createEntrada = async (
  data: CreateEntradaFinanceiraInput,
  usuarioId: number
) => {
  if (data.valor <= 0) {
    const error = new Error("Valor deve ser maior que zero.");
    (error as any).statusCode = 400;
    throw error;
  }

  // Usar transação para garantir consistência
  const entrada = await prisma.$transaction(async (tx) => {
    // Criar entrada financeira
    const novaEntrada = await tx.entradaFinanceira.create({
      data: {
        usuarioId,
        tipo: data.tipo,
        valor: parseFloat(data.valor.toFixed(2)),
        observacao: data.descricao || null,
        data: data.data ? new Date(data.data) : new Date(),
      },
      select: {
        id: true,
        tipo: true,
        valor: true,
        data: true,
        observacao: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        criadoEm: true,
      },
    });

    // Registrar movimentação financeira positiva (entrada)
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        tipo: "entrada_financeira",
        referenciaId: novaEntrada.id,
        descricao: `Entrada Financeira (${novaEntrada.tipo})`,
        valor: parseFloat(data.valor.toFixed(2)),
        entrada: true,
      },
    });

    return novaEntrada;
  });

  return entrada;
};

/**
 * Atualiza uma entrada financeira existente e ajusta a movimentação
 */
export const updateEntrada = async (
  id: number,
  data: UpdateEntradaFinanceiraInput,
  usuarioId: number
) => {
  // Buscar entrada existente
  const entradaExistente = await prisma.entradaFinanceira.findUnique({
    where: { id },
  });

  if (!entradaExistente) {
    const error = new Error("Entrada financeira não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (entradaExistente.usuarioId !== usuarioId) {
    const error = new Error("Você não tem permissão para editar esta entrada.");
    (error as any).statusCode = 403;
    throw error;
  }

  if (data.valor && data.valor <= 0) {
    const error = new Error("Valor deve ser maior que zero.");
    (error as any).statusCode = 400;
    throw error;
  }

  // Usar transação para atualizar entrada e movimentação
  const entradaAtualizada = await prisma.$transaction(async (tx) => {
    const novoValor = data.valor || entradaExistente.valor;

    // Atualizar entrada financeira
    const atualizada = await tx.entradaFinanceira.update({
      where: { id },
      data: {
        tipo: data.tipo || entradaExistente.tipo,
        valor: parseFloat(novoValor.toFixed(2)),
        observacao:
          data.descricao !== undefined
            ? data.descricao
            : entradaExistente.observacao,
        data: data.data ? new Date(data.data) : entradaExistente.data,
      },
      select: {
        id: true,
        tipo: true,
        valor: true,
        data: true,
        observacao: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        criadoEm: true,
      },
    });

    // Se o valor foi alterado, atualizar a movimentação correspondente
    if (
      data.valor &&
      data.valor !== parseFloat(entradaExistente.valor.toString())
    ) {
      await tx.movimentacaoFinanceira.updateMany({
        where: {
          referenciaId: id,
          tipo: "entrada_financeira",
        },
        data: {
          valor: parseFloat(data.valor.toFixed(2)),
        },
      });
    }

    return atualizada;
  });

  return entradaAtualizada;
};

/**
 * Deleta uma entrada financeira e registra uma movimentação de reversão
 */
export const deleteEntrada = async (id: number, usuarioId: number) => {
  // Buscar entrada
  const entrada = await prisma.entradaFinanceira.findUnique({
    where: { id },
  });

  if (!entrada) {
    const error = new Error("Entrada financeira não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (entrada.usuarioId !== usuarioId) {
    const error = new Error(
      "Você não tem permissão para deletar esta entrada."
    );
    (error as any).statusCode = 403;
    throw error;
  }

  // Usar transação para deletar entrada e criar movimentação de reversão
  const resultado = await prisma.$transaction(async (tx) => {
    // Registrar movimentação de saída reversa
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        tipo: "reversao_entrada",
        referenciaId: id,
        descricao: `Estorno de Entrada Financeira #${id}`,
        valor: parseFloat(entrada.valor.toString()),
        entrada: false,
      },
    });

    // Deletar a entrada financeira
    const entradaDeletada = await tx.entradaFinanceira.delete({
      where: { id },
      select: {
        id: true,
        tipo: true,
        valor: true,
        data: true,
        observacao: true,
        usuarioId: true,
        criadoEm: true,
      },
    });

    return entradaDeletada;
  });

  return resultado;
};
