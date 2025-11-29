import { prisma } from "../config/prisma";
import { CreateAjusteInput } from "../validators/movimentacao.schema";

interface MovimentacaoFilters {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: string;
  usuarioId?: number;
  entrada?: boolean;
}

interface RegistrarMovimentacaoInput {
  usuarioId: number;
  tipo: string;
  referenciaId?: number | null;
  descricao: string;
  valor: number;
  entrada: boolean;
}

/**
 * Registra uma movimentação financeira com cálculo automático de saldo
 */
export const registrar = async (data: RegistrarMovimentacaoInput) => {
  if (data.valor <= 0) {
    const error = new Error("Valor deve ser maior que zero.");
    (error as any).statusCode = 400;
    throw error;
  }

  // Buscar última movimentação do usuário para calcular saldo anterior
  const ultimaMovimentacao = await prisma.movimentacaoFinanceira.findFirst({
    where: { usuarioId: data.usuarioId },
    orderBy: { criadoEm: "desc" },
    select: { saldoApos: true },
  });

  let saldoApos: number;

  if (ultimaMovimentacao && ultimaMovimentacao.saldoApos) {
    // Calcular saldo baseado na última movimentação
    const saldoAnterior = parseFloat(ultimaMovimentacao.saldoApos.toString());
    saldoApos = data.entrada
      ? saldoAnterior + data.valor
      : saldoAnterior - data.valor;
  } else {
    // Buscar saldo inicial da configuração
    const configuracao = await prisma.configuracao.findFirst();
    const saldoInicial = configuracao?.saldoInicial
      ? parseFloat(configuracao.saldoInicial.toString())
      : 0;

    saldoApos = data.entrada
      ? saldoInicial + data.valor
      : saldoInicial - data.valor;
  }

  // Criar movimentação
  const movimentacao = await prisma.movimentacaoFinanceira.create({
    data: {
      usuarioId: data.usuarioId,
      tipo: data.tipo,
      referenciaId: data.referenciaId || null,
      descricao: data.descricao,
      valor: parseFloat(data.valor.toFixed(2)),
      entrada: data.entrada,
      saldoApos: parseFloat(saldoApos.toFixed(2)),
    },
    select: {
      id: true,
      tipo: true,
      referenciaId: true,
      descricao: true,
      valor: true,
      entrada: true,
      data: true,
      saldoApos: true,
      usuarioId: true,
      criadoEm: true,
    },
  });

  return movimentacao;
};

/**
 * Lista todas as movimentações financeiras com filtros opcionais
 */
export const listMovimentacoes = async (filters?: MovimentacaoFilters) => {
  const movimentacoes = await prisma.movimentacaoFinanceira.findMany({
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
      ...(filters?.entrada !== undefined && { entrada: filters.entrada }),
    },
    select: {
      id: true,
      tipo: true,
      referenciaId: true,
      descricao: true,
      valor: true,
      entrada: true,
      data: true,
      saldoApos: true,
      usuarioId: true,
      criadoEm: true,
    },
    orderBy: {
      data: "asc",
    },
  });

  return movimentacoes;
};

/**
 * Obtém uma movimentação específica
 */
export const getById = async (id: number) => {
  const movimentacao = await prisma.movimentacaoFinanceira.findUnique({
    where: { id },
    select: {
      id: true,
      tipo: true,
      referenciaId: true,
      descricao: true,
      valor: true,
      entrada: true,
      data: true,
      saldoApos: true,
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

  if (!movimentacao) {
    const error = new Error("Movimentação financeira não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  return movimentacao;
};

/**
 * Retorna o saldo atual do usuário
 */
export const getSaldoAtual = async (usuarioId: number) => {
  // Buscar última movimentação
  const ultimaMovimentacao = await prisma.movimentacaoFinanceira.findFirst({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
    select: { saldoApos: true },
  });

  if (ultimaMovimentacao && ultimaMovimentacao.saldoApos) {
    return parseFloat(ultimaMovimentacao.saldoApos.toString());
  }

  // Se não existir movimentações, retornar saldo inicial da configuração
  const configuracao = await prisma.configuracao.findFirst();
  const saldoInicial = configuracao?.saldoInicial
    ? parseFloat(configuracao.saldoInicial.toString())
    : 0;

  return saldoInicial;
};

/**
 * Retorna resumo para dashboard financeiro
 */
export const getDashboardResumo = async (usuarioId: number) => {
  // Buscar todas as movimentações do usuário
  const movimentacoes = await prisma.movimentacaoFinanceira.findMany({
    where: { usuarioId },
    select: {
      tipo: true,
      valor: true,
      entrada: true,
      saldoApos: true,
    },
    orderBy: { data: "desc" },
  });

  // Calcular totais
  const totalEntradas = movimentacoes
    .filter((m) => m.entrada)
    .reduce((sum, m) => sum + parseFloat(m.valor.toString()), 0);

  const totalSaidas = movimentacoes
    .filter((m) => !m.entrada)
    .reduce((sum, m) => sum + parseFloat(m.valor.toString()), 0);

  const lucro = totalEntradas - totalSaidas;

  // Agrupar por tipo
  const entradasPorTipo: { [key: string]: number } = {};
  const saidasPorTipo: { [key: string]: number } = {};

  movimentacoes.forEach((m) => {
    const valor = parseFloat(m.valor.toString());
    if (m.entrada) {
      entradasPorTipo[m.tipo] = (entradasPorTipo[m.tipo] || 0) + valor;
    } else {
      saidasPorTipo[m.tipo] = (saidasPorTipo[m.tipo] || 0) + valor;
    }
  });

  // Buscar 5 últimas movimentações
  const movimentacoesRecentes = await prisma.movimentacaoFinanceira.findMany({
    where: { usuarioId },
    select: {
      id: true,
      tipo: true,
      descricao: true,
      valor: true,
      entrada: true,
      data: true,
      saldoApos: true,
    },
    orderBy: { data: "desc" },
    take: 5,
  });

  // Buscar saldo atual
  const saldoAtual = await getSaldoAtual(usuarioId);

  return {
    totalEntradas: parseFloat(totalEntradas.toFixed(2)),
    totalSaidas: parseFloat(totalSaidas.toFixed(2)),
    lucro: parseFloat(lucro.toFixed(2)),
    entradasPorTipo,
    saidasPorTipo,
    movimentacoesRecentes,
    saldoAtual,
  };
};

/**
 * Registra uma movimentação de ajuste manual
 */
export const registrarAjuste = async (
  data: CreateAjusteInput,
  usuarioId: number
) => {
  if (data.valor <= 0) {
    const error = new Error("Valor deve ser maior que zero.");
    (error as any).statusCode = 400;
    throw error;
  }

  // Registrar como movimentação do tipo "ajuste"
  const ajuste = await registrar({
    usuarioId,
    tipo: "ajuste",
    descricao: data.descricao,
    valor: data.valor,
    entrada: data.entrada,
  });

  return ajuste;
};
