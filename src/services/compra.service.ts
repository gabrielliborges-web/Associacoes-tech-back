import { prisma } from "../config/prisma";
import {
  CreateCompraInput,
  ItemCompraInput,
} from "../validators/compra.schema";

interface CompraFilters {
  dataInicio?: Date;
  dataFim?: Date;
  fornecedor?: string;
}

/**
 * Lista todas as compras do usuário logado com filtros opcionais
 */
export const listCompras = async (
  usuarioId: number,
  filters?: CompraFilters
) => {
  const compras = await prisma.compra.findMany({
    where: {
      usuarioId,
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
      ...(filters?.fornecedor && {
        fornecedor: {
          contains: filters.fornecedor,
          mode: "insensitive",
        },
      }),
    },
    select: {
      id: true,
      fornecedor: true,
      data: true,
      total: true,
      observacao: true,
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
          custoUnit: true,
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
    orderBy: {
      data: "desc",
    },
  });

  return compras;
};

/**
 * Obtém uma compra pelo ID com seus itens
 */
export const getCompraById = async (id: number) => {
  const compra = await prisma.compra.findUnique({
    where: { id },
    select: {
      id: true,
      fornecedor: true,
      data: true,
      total: true,
      observacao: true,
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
          custoUnit: true,
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

  if (!compra) {
    const error: any = new Error("Compra não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  return compra;
};

/**
 * Valida os itens da compra
 */
export const validateCompraItems = async (itens: ItemCompraInput[]) => {
  if (!itens || itens.length === 0) {
    const error: any = new Error("A compra deve conter pelo menos um item.");
    error.statusCode = 400;
    throw error;
  }

  for (const item of itens) {
    // Validar quantidade
    if (item.quantidade <= 0) {
      const error: any = new Error(
        `Quantidade deve ser maior que zero. Produto ID: ${item.produtoId}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar custo
    if (item.custoUnit <= 0) {
      const error: any = new Error(
        `Custo unitário deve ser maior que zero. Produto ID: ${item.produtoId}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: item.produtoId },
      select: { id: true, nome: true, ativo: true },
    });

    if (!produto) {
      const error: any = new Error(
        `Produto com ID ${item.produtoId} não encontrado.`
      );
      error.statusCode = 404;
      throw error;
    }

    if (!produto.ativo) {
      const error: any = new Error(`Produto "${produto.nome}" está inativo.`);
      error.statusCode = 400;
      throw error;
    }
  }
};

/**
 * Cria uma nova compra com itens
 */
export const createCompra = async (
  data: CreateCompraInput,
  usuarioId: number
) => {
  // Validar itens
  await validateCompraItems(data.itens);

  // Calcular total
  let total = 0;
  for (const item of data.itens) {
    total += Number(item.custoUnit) * item.quantidade;
  }

  // Criar transação
  const compra = await prisma.$transaction(async (tx) => {
    // Criar compra
    const novaCompra = await tx.compra.create({
      data: {
        fornecedor: data.fornecedor || null,
        data: data.data ? new Date(data.data) : new Date(),
        total: parseFloat(total.toFixed(2)),
        observacao: data.descricao || null,
        usuarioId,
        itens: {
          create: data.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            custoUnit: parseFloat(String(item.custoUnit)),
          })),
        },
      },
      select: {
        id: true,
        fornecedor: true,
        data: true,
        total: true,
        observacao: true,
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
            custoUnit: true,
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

    // Atualizar estoque dos produtos
    for (const item of data.itens) {
      await tx.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            increment: item.quantidade,
          },
        },
      });
    }

    // Criar movimentação financeira (saída de dinheiro)
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        data: new Date(),
        tipo: "compra",
        referenciaId: novaCompra.id,
        descricao: `Compra de produtos (#${novaCompra.id})${
          novaCompra.fornecedor ? ` - Fornecedor: ${novaCompra.fornecedor}` : ""
        }`,
        valor: parseFloat(total.toFixed(2)),
        entrada: false,
      },
    });

    return novaCompra;
  });

  return compra;
};

/**
 * Deleta uma compra (soft delete ou revert de estoque)
 */
export const deleteCompra = async (id: number, usuarioId: number) => {
  // Verificar se compra existe
  const compra = await prisma.compra.findUnique({
    where: { id },
    include: {
      itens: {
        select: {
          produtoId: true,
          quantidade: true,
        },
      },
    },
  });

  if (!compra) {
    const error: any = new Error("Compra não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  // Executar transação para reverter estoque e criar movimentação
  await prisma.$transaction(async (tx) => {
    // Reverter estoque
    for (const item of compra.itens) {
      // Verificar se tem estoque suficiente para reverter
      const produto = await tx.produto.findUnique({
        where: { id: item.produtoId },
        select: { estoque: true, nome: true },
      });

      if (produto && produto.estoque < item.quantidade) {
        throw new Error(
          `Não é possível reverter: produto "${produto.nome}" não tem estoque suficiente.`
        );
      }

      await tx.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            decrement: item.quantidade,
          },
        },
      });
    }

    // Criar movimentação financeira reversa (entrada de dinheiro)
    await tx.movimentacaoFinanceira.create({
      data: {
        usuarioId,
        data: new Date(),
        tipo: "compra_cancelada",
        referenciaId: id,
        descricao: `Estorno/Cancelamento da compra (#${id})`,
        valor: parseFloat(compra.total.toString()),
        entrada: true,
      },
    });

    // Deletar compra e seus itens (cascade)
    await tx.compra.delete({
      where: { id },
    });
  });

  return { message: "Compra deletada e estoque revertido com sucesso." };
};
