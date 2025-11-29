import { prisma } from "../config/prisma";
import {
  CreateProdutoInput,
  UpdateProdutoInput,
} from "../validators/produto.schema";
import { uploadFileToS3, s3, safeFileKey } from "../config/awsConfig";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Lista todos os produtos com filtros opcionais
 */
export const listProdutos = async (filters?: {
  nome?: string;
  categoriaId?: number;
  ativo?: boolean;
  usuarioId?: number;
}) => {
  const produtos = await prisma.produto.findMany({
    where: {
      ...(filters?.nome && {
        nome: {
          contains: filters.nome,
          mode: "insensitive",
        },
      }),
      ...(filters?.categoriaId && { categoriaId: filters.categoriaId }),
      ...(filters?.ativo !== undefined && { ativo: filters.ativo }),
      ...(filters?.usuarioId && { usuarioId: filters.usuarioId }),
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      categoriaId: true,
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
      precoVenda: true,
      precoCompra: true,
      precoPromocional: true,
      estoque: true,
      ativo: true,
      imagem: true,
      usuarioId: true,
      criadoEm: true,
      atualizadoEm: true,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });

  return produtos;
};

/**
 * Obtém um produto pelo ID
 */
export const getProdutoById = async (id: number) => {
  const produto = await prisma.produto.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      descricao: true,
      categoriaId: true,
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
      precoVenda: true,
      precoCompra: true,
      precoPromocional: true,
      estoque: true,
      ativo: true,
      imagem: true,
      usuarioId: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  if (!produto) {
    const error: any = new Error("Produto não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  return produto;
};

/**
 * Cria um novo produto
 */
export const createProduto = async (
  data: CreateProdutoInput,
  file?: Express.Multer.File,
  usuarioId?: number
) => {
  // Valida se usuarioId foi fornecido
  if (!usuarioId) {
    const error: any = new Error("Usuário não identificado.");
    error.statusCode = 401;
    throw error;
  }

  // Verifica se nome já existe para este usuário
  const existingProduto = await prisma.produto.findFirst({
    where: {
      nome: {
        equals: data.nome,
        mode: "insensitive",
      },
      usuarioId,
    },
  });

  if (existingProduto) {
    const error: any = new Error(
      "Produto com esse nome já existe para este usuário."
    );
    error.statusCode = 409;
    throw error;
  }

  // Upload de imagem se fornecida
  let imagemUrl: string | null = null;
  if (file) {
    try {
      const key = safeFileKey(usuarioId, data.nome, "cover", file.originalname);
      imagemUrl = await uploadFileToS3(file, key);
    } catch (error: any) {
      const err: any = new Error("Erro ao fazer upload da imagem.");
      err.statusCode = 400;
      throw err;
    }
  }

  // Cria produto
  const produto = await prisma.produto.create({
    data: {
      nome: data.nome,
      descricao: data.descricao || null,
      categoriaId: data.categoriaId || null,
      precoVenda: data.precoVenda,
      precoCompra: data.precoCompra ?? null,
      precoPromocional: data.precoPromocional ?? null,
      estoque: data.estoqueInicial || 0,
      imagem: imagemUrl,
      usuarioId,
      ativo: true,
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      categoriaId: true,
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
      precoVenda: true,
      precoCompra: true,
      precoPromocional: true,
      estoque: true,
      ativo: true,
      imagem: true,
      usuarioId: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return produto;
};

/**
 * Atualiza um produto
 */
export const updateProduto = async (
  id: number,
  data: UpdateProdutoInput,
  file?: Express.Multer.File
) => {
  // Verifica se produto existe
  const produto = await prisma.produto.findUnique({
    where: { id },
  });

  if (!produto) {
    const error: any = new Error("Produto não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Se o nome está sendo alterado, verifica se já existe
  if (data.nome && data.nome !== produto.nome) {
    const existingProduto = await prisma.produto.findFirst({
      where: {
        nome: {
          equals: data.nome,
          mode: "insensitive",
        },
        usuarioId: produto.usuarioId,
        NOT: {
          id,
        },
      },
    });

    if (existingProduto) {
      const error: any = new Error(
        "Produto com esse nome já existe para este usuário."
      );
      error.statusCode = 409;
      throw error;
    }
  }

  let novaImagemUrl: string | null | undefined = undefined;

  // Se nova imagem foi enviada
  if (file) {
    // Deleta a imagem antiga do S3 se existir
    if (produto.imagem) {
      try {
        await deleteImageFromS3(produto.imagem);
      } catch (error) {
        console.error("Erro ao deletar imagem antiga:", error);
      }
    }

    // Upload da nova imagem
    try {
      const key = safeFileKey(
        produto.usuarioId ?? undefined,
        data.nome || produto.nome,
        "cover",
        file.originalname
      );
      novaImagemUrl = await uploadFileToS3(file, key);
    } catch (error: any) {
      const err: any = new Error("Erro ao fazer upload da imagem.");
      err.statusCode = 400;
      throw err;
    }
  }

  // Atualiza produto
  const produtoAtualizado = await prisma.produto.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.categoriaId !== undefined && { categoriaId: data.categoriaId }),
      ...(data.precoVenda !== undefined && {
        precoVenda: parseFloat(String(data.precoVenda)),
      }),
      ...(data.precoCompra !== undefined && {
        precoCompra: data.precoCompra
          ? parseFloat(String(data.precoCompra))
          : null,
      }),
      ...(data.precoPromocional !== undefined && {
        precoPromocional: data.precoPromocional
          ? parseFloat(String(data.precoPromocional))
          : null,
      }),
      ...(novaImagemUrl !== undefined && { imagem: novaImagemUrl }),
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      categoriaId: true,
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
      precoVenda: true,
      precoCompra: true,
      precoPromocional: true,
      estoque: true,
      ativo: true,
      imagem: true,
      usuarioId: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return produtoAtualizado;
};

/**
 * Atualiza o status (ativo/inativo) de um produto
 */
export const updateProdutoStatus = async (id: number, ativo: boolean) => {
  // Verifica se produto existe
  const produto = await prisma.produto.findUnique({
    where: { id },
  });

  if (!produto) {
    const error: any = new Error("Produto não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Atualiza status
  const produtoAtualizado = await prisma.produto.update({
    where: { id },
    data: { ativo },
    select: {
      id: true,
      nome: true,
      descricao: true,
      categoriaId: true,
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
      precoVenda: true,
      precoCompra: true,
      precoPromocional: true,
      estoque: true,
      ativo: true,
      imagem: true,
      usuarioId: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return produtoAtualizado;
};

/**
 * Deleta um produto (soft delete - marca como inativo)
 * Ou hard delete se não tiver vendas/compras
 */
export const deleteProduto = async (id: number) => {
  // Verifica se produto existe
  const produto = await prisma.produto.findUnique({
    where: { id },
  });

  if (!produto) {
    const error: any = new Error("Produto não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Verifica se há vendas ou compras vinculadas
  const vendasVinculadas = await prisma.itemVenda.count({
    where: { produtoId: id },
  });

  const comprasVinculadas = await prisma.itemCompra.count({
    where: { produtoId: id },
  });

  if (vendasVinculadas > 0 || comprasVinculadas > 0) {
    // Se há vinculações, faz soft delete
    await prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });

    return {
      message:
        "Produto marcado como inativo (possuía vendas/compras vinculadas).",
    };
  }

  // Se não há vinculações, faz hard delete
  // Deleta imagem do S3 se existir
  if (produto.imagem) {
    try {
      await deleteImageFromS3(produto.imagem);
    } catch (error) {
      console.error("Erro ao deletar imagem do S3:", error);
    }
  }

  // Remove produto
  await prisma.produto.delete({
    where: { id },
  });

  return { message: "Produto deletado com sucesso." };
};

/**
 * Deleta uma imagem do S3
 */
export const deleteImageFromS3 = async (imageUrl: string) => {
  try {
    // Extrai a key da URL
    // URL formato: https://bucket.s3.region.amazonaws.com/key
    const urlParts = imageUrl.split(".s3.");
    if (!urlParts[1]) throw new Error("URL inválida");

    const keyPart = urlParts[1].split("/").slice(2).join("/");

    if (!keyPart) {
      console.warn("Não foi possível extrair a chave S3 da URL:", imageUrl);
      return;
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: keyPart,
      })
    );
  } catch (error) {
    console.error("Erro ao deletar arquivo do S3:", error);
    throw error;
  }
};
