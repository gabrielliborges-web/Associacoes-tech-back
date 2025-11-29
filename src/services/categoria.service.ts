import { prisma } from "../config/prisma";
import {
  CreateCategoriaInput,
  UpdateCategoriaInput,
} from "../validators/categoria.schema";

/**
 * Lista todas as categorias
 */
export const listCategorias = async () => {
  const categorias = await prisma.categoria.findMany({
    select: {
      id: true,
      nome: true,
      descricao: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return categorias;
};

/**
 * Obtém uma categoria pelo ID
 */
export const getCategoriaById = async (id: number) => {
  const categoria = await prisma.categoria.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      descricao: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  if (!categoria) {
    const error: any = new Error("Categoria não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

/**
 * Cria uma nova categoria
 */
export const createCategoria = async (data: CreateCategoriaInput) => {
  // Verifica se nome já existe
  const existingCategoria = await prisma.categoria.findFirst({
    where: {
      nome: {
        equals: data.nome,
        mode: "insensitive",
      },
    },
  });

  if (existingCategoria) {
    const error: any = new Error("Categoria com esse nome já existe.");
    error.statusCode = 409;
    throw error;
  }

  // Cria categoria
  const categoria = await prisma.categoria.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      ativo: data.ativo ?? true,
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return categoria;
};

/**
 * Atualiza uma categoria
 */
export const updateCategoria = async (
  id: number,
  data: UpdateCategoriaInput
) => {
  // Verifica se categoria existe
  const categoria = await prisma.categoria.findUnique({
    where: { id },
  });

  if (!categoria) {
    const error: any = new Error("Categoria não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  // Se o nome está sendo alterado, verifica se já existe
  if (data.nome && data.nome !== categoria.nome) {
    const existingCategoria = await prisma.categoria.findFirst({
      where: {
        nome: {
          equals: data.nome,
          mode: "insensitive",
        },
      },
    });

    if (existingCategoria) {
      const error: any = new Error("Categoria com esse nome já existe.");
      error.statusCode = 409;
      throw error;
    }
  }

  // Atualiza categoria
  const categoriaAtualizada = await prisma.categoria.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.ativo !== undefined && { ativo: data.ativo }),
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return categoriaAtualizada;
};

/**
 * Deleta uma categoria
 * Não permite deletar se houver produtos vinculados
 */
export const deleteCategoria = async (id: number) => {
  // Verifica se categoria existe
  const categoria = await prisma.categoria.findUnique({
    where: { id },
  });

  if (!categoria) {
    const error: any = new Error("Categoria não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  // Verifica se há produtos vinculados
  const produtosVinculados = await prisma.produto.count({
    where: {
      categoriaId: id,
    },
  });

  if (produtosVinculados > 0) {
    const error: any = new Error(
      "Não é possível deletar uma categoria que possui produtos vinculados."
    );
    error.statusCode = 409;
    throw error;
  }

  // Remove categoria
  await prisma.categoria.delete({
    where: { id },
  });

  return { message: "Categoria deletada com sucesso." };
};
