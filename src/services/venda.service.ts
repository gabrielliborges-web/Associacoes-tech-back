import { prisma } from "../config/prisma";
import { CreateVendaInput, ItemVendaInput } from "../validators/venda.schema";

interface VendaFilters {
  dataInicio?: Date;
  dataFim?: Date;
  formaPagamento?: string;
  usuarioId?: number;
}

/**
 * Lista todas as vendas com filtros opcionais
 */
export const listVendas = async (filters?: VendaFilters) => {
  const vendas = await prisma.venda.findMany({
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
      ...(filters?.formaPagamento && {
        formaPagamento: {
          contains: filters.formaPagamento,
          mode: "insensitive",
        },
      }),
      ...(filters?.usuarioId && { usuarioId: filters.usuarioId }),
    },
    select: {
      id: true,
      formaPagamento: true,
      data: true,
      total: true,
      descricao: true,
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

  return vendas;
};

/**
 * Obtém uma venda específica com seus itens e detalhes
 */
export const getVendaById = async (id: number) => {
  const venda = await prisma.venda.findUnique({
    where: { id },
    select: {
      id: true,
      formaPagamento: true,
      data: true,
      total: true,
      descricao: true,
      usuarioId: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      itens: {
        select: {
          id: true,
          quantidade: true,
          precoUnit: true,
          produtoId: true,
          produto: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              estoque: true,
            },
          },
        },
      },
      criadoEm: true,
    },
  });

  if (!venda) {
    const error = new Error("Venda não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  return venda;
};

/**
 * Valida os itens da venda antes de processar
 */
export const validateVendaItems = async (itens: ItemVendaInput[]) => {
  for (const item of itens) {
    const produto = await prisma.produto.findUnique({
      where: { id: item.produtoId },
    });

    if (!produto) {
      const error = new Error(
        `Produto com ID ${item.produtoId} não encontrado.`
      );
      (error as any).statusCode = 404;
      throw error;
    }

    if (!produto.ativo) {
      const error = new Error(`Produto "${produto.nome}" não está disponível.`);
      (error as any).statusCode = 400;
      throw error;
    }

    if (item.quantidade <= 0) {
      const error = new Error(
        `Quantidade do produto "${produto.nome}" deve ser maior que zero.`
      );
      (error as any).statusCode = 400;
      throw error;
    }

    if (produto.estoque < item.quantidade) {
      const error = new Error(
        `Estoque insuficiente do produto "${produto.nome}". Disponível: ${produto.estoque}, solicitado: ${item.quantidade}.`
      );
      (error as any).statusCode = 400;
      throw error;
    }

    if (item.precoUnit <= 0) {
      const error = new Error(
        `Preço unitário do produto "${produto.nome}" deve ser maior que zero.`
      );
      (error as any).statusCode = 400;
      throw error;
    }
  }
};

/**
 * Cria uma nova venda com itens, atualiza estoque e registra movimentação financeira
 */
export const createVenda = async (
  data: CreateVendaInput,
  usuarioId: number
) => {
  // Validar itens
  await validateVendaItems(data.itens);

  // Calcular total
  const total = data.itens.reduce(
    (sum, item) => sum + item.quantidade * item.precoUnit,
    0
  );

  // Usar transação para garantir consistência
  const venda = await prisma.$transaction(async (tx) => {
    // Criar venda
    const novaVenda = await tx.venda.create({
      data: {
        usuarioId,
        formaPagamento: data.formaPagamento,
        data: data.data ? new Date(data.data) : new Date(),
        total: parseFloat(total.toFixed(2)),
        descricao: data.descricao || null,
        itens: {
          create: data.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: parseFloat(item.precoUnit.toFixed(2)),
          })),
        },
      },
      select: {
        id: true,
        formaPagamento: true,
        data: true,
        total: true,
        descricao: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        itens: {
          select: {
            id: true,
            quantidade: true,
            precoUnit: true,
            produtoId: true,
            produto: {
              select: {
                id: true,
                nome: true,
                descricao: true,
              },
            },
          },
        },
        criadoEm: true,
      },
    });

    // Atualizar estoque de cada produto (decrement)
    for (const item of data.itens) {
      await tx.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            decrement: item.quantidade,
          },
        },
      });
    }

    // Registrar movimentação financeira (entrada)
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        tipo: "venda",
        referenciaId: novaVenda.id,
        descricao: `Venda #${novaVenda.id}`,
        valor: parseFloat(total.toFixed(2)),
        entrada: true,
      },
    });

    return novaVenda;
  });

  return venda;
};

/**
 * Cancela uma venda existente, reverte o estoque e registra movimentação de reversão
 */
export const cancelVenda = async (id: number, usuarioId: number) => {
  // Buscar venda
  const venda = await prisma.venda.findUnique({
    where: { id },
    include: {
      itens: true,
    },
  });

  if (!venda) {
    const error = new Error("Venda não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (venda.usuarioId !== usuarioId) {
    const error = new Error("Você não tem permissão para cancelar esta venda.");
    (error as any).statusCode = 403;
    throw error;
  }

  // Usar transação para reverter estoque e criar movimentação
  const resultado = await prisma.$transaction(async (tx) => {
    // Reverter estoque de cada item
    for (const item of venda.itens) {
      await tx.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            increment: item.quantidade,
          },
        },
      });
    }

    // Registrar movimentação de reversão (saída)
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        tipo: "cancelamento_venda",
        referenciaId: venda.id,
        descricao: `Cancelamento da venda #${venda.id}`,
        valor: parseFloat(venda.total.toString()),
        entrada: false,
      },
    });

    // Deletar a venda (cascade deleta ItemVenda)
    const vendaDeletada = await tx.venda.delete({
      where: { id },
      select: {
        id: true,
        formaPagamento: true,
        data: true,
        total: true,
        descricao: true,
        usuarioId: true,
        criadoEm: true,
      },
    });

    return vendaDeletada;
  });

  return resultado;
};
