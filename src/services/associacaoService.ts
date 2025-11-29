import { prisma } from "../config/prisma";
import {
  CreateAssociacaoInput,
  UpdateAssociacaoInput,
} from "../validators/associacao.schema";

export const listAssociacoes = async (ativa?: boolean) => {
  const where: any = {};
  if (ativa !== undefined) where.ativa = ativa;

  return prisma.associacao.findMany({
    where,
    select: {
      id: true,
      nome: true,
      apelido: true,
      descricao: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      ativa: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });
};

export const getAssociacaoById = async (id: number) => {
  const associacao = await prisma.associacao.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      apelido: true,
      descricao: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      ativa: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  return associacao;
};

export const createAssociacao = async (data: CreateAssociacaoInput) => {
  const associacao = await prisma.associacao.create({
    data: {
      nome: data.nome,
      apelido: data.apelido,
      descricao: data.descricao,
      cidade: data.cidade,
      estado: data.estado,
      logoUrl: data.logoUrl,
      ativa: data.ativa,
    },
    select: {
      id: true,
      nome: true,
      apelido: true,
      descricao: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      ativa: true,
      criadoEm: true,
    },
  });

  return associacao;
};

export const updateAssociacao = async (
  id: number,
  data: UpdateAssociacaoInput
) => {
  const associacao = await prisma.associacao.findUnique({ where: { id } });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.associacao.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.apelido && { apelido: data.apelido }),
      ...(data.descricao && { descricao: data.descricao }),
      ...(data.cidade && { cidade: data.cidade }),
      ...(data.estado && { estado: data.estado }),
      ...(data.logoUrl && { logoUrl: data.logoUrl }),
      ...(data.ativa !== undefined && { ativa: data.ativa }),
    },
    select: {
      id: true,
      nome: true,
      apelido: true,
      descricao: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      ativa: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return updated;
};

export const deactivateAssociacao = async (id: number) => {
  const associacao = await prisma.associacao.findUnique({ where: { id } });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.associacao.update({ where: { id }, data: { ativa: false } });
  return { message: "Associação desativada com sucesso." };
};
