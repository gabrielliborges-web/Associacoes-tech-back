// Minha Associação
export const getMinhaAssociacao = async (
  usuarioId: number,
  associacaoId: number
) => {
  // Garante que o usuário pertence à associação
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario || usuario.associacaoId !== associacaoId) {
    const error: any = new Error("Usuário não pertence à associação.");
    error.statusCode = 403;
    throw error;
  }
  const associacao = await prisma.associacao.findUnique({
    where: { id: associacaoId },
    select: {
      id: true,
      nome: true,
      apelido: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      regrasInternas: true,
      horarioPadraoInicio: true,
      horarioPadraoFim: true,
      tipoJogoPadrao: true,
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

export const atualizarMinhaAssociacao = async (
  usuarioId: number,
  associacaoId: number,
  data: Partial<{
    nome?: string;
    apelido?: string;
    cidade?: string;
    estado?: string;
    logoUrl?: string;
    regrasInternas?: string;
    horarioPadraoInicio?: string;
    horarioPadraoFim?: string;
    tipoJogoPadrao?: string;
  }>
) => {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario || usuario.associacaoId !== associacaoId) {
    const error: any = new Error("Usuário não pertence à associação.");
    error.statusCode = 403;
    throw error;
  }
  const updateData: any = {
    ...(data.nome !== undefined && { nome: data.nome }),
    ...(data.apelido !== undefined && { apelido: data.apelido }),
    ...(data.cidade !== undefined && { cidade: data.cidade }),
    ...(data.estado !== undefined && { estado: data.estado }),
    ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
    ...(data.regrasInternas !== undefined && {
      regrasInternas: data.regrasInternas,
    }),
    ...(data.horarioPadraoInicio !== undefined && {
      horarioPadraoInicio: data.horarioPadraoInicio,
    }),
    ...(data.horarioPadraoFim !== undefined && {
      horarioPadraoFim: data.horarioPadraoFim,
    }),
    ...(data.tipoJogoPadrao !== undefined && {
      tipoJogoPadrao: { set: data.tipoJogoPadrao },
    }),
  };
  const updated = await prisma.associacao.update({
    where: { id: associacaoId },
    data: updateData,
    select: {
      id: true,
      nome: true,
      apelido: true,
      cidade: true,
      estado: true,
      logoUrl: true,
      regrasInternas: true,
      horarioPadraoInicio: true,
      horarioPadraoFim: true,
      tipoJogoPadrao: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });
  return updated;
};
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
