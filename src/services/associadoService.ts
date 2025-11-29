import { prisma } from "../config/prisma";
import {
  CreateAssociadoInput,
  UpdateAssociadoInput,
} from "../validators/associado.schema";

export const createAssociado = async (
  associacaoId: number,
  data: CreateAssociadoInput
) => {
  const associacao = await prisma.associacao.findUnique({
    where: { id: associacaoId },
  });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  const associado = await prisma.associado.create({
    data: {
      associacaoId,
      nome: data.nome,
      apelido: data.apelido,
      dataNascimento: data.dataNascimento
        ? new Date(data.dataNascimento)
        : null,
      telefone: data.telefone,
      email: data.email,
      fotoUrl: data.fotoUrl,
      numeroCamisaPadrao: data.numeroCamisaPadrao,
      posicaoPreferida: data.posicaoPreferida as any,
      pernaDominante: data.pernaDominante as any,
      ativo: data.ativo,
      observacoes: data.observacoes,
    },
  });

  return associado;
};

export const listAssociados = async (associacaoId: number) => {
  const associacao = await prisma.associacao.findUnique({
    where: { id: associacaoId },
  });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  return prisma.associado.findMany({ where: { associacaoId } });
};

export const getAssociadoById = async (id: number) => {
  const associado = await prisma.associado.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }
  return associado;
};

export const updateAssociado = async (
  id: number,
  data: UpdateAssociadoInput
) => {
  const associado = await prisma.associado.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.associado.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.apelido && { apelido: data.apelido }),
      ...(data.dataNascimento && {
        dataNascimento: new Date(data.dataNascimento),
      }),
      ...(data.telefone && { telefone: data.telefone }),
      ...(data.email && { email: data.email }),
      ...(data.fotoUrl && { fotoUrl: data.fotoUrl }),
      ...(data.numeroCamisaPadrao !== undefined && {
        numeroCamisaPadrao: data.numeroCamisaPadrao,
      }),
      ...(data.posicaoPreferida && {
        posicaoPreferida: data.posicaoPreferida as any,
      }),
      ...(data.pernaDominante && {
        pernaDominante: data.pernaDominante as any,
      }),
      ...(data.ativo !== undefined && { ativo: data.ativo }),
      ...(data.observacoes && { observacoes: data.observacoes }),
    },
  });

  return updated;
};

export const deactivateAssociado = async (id: number) => {
  const associado = await prisma.associado.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.associado.update({ where: { id }, data: { ativo: false } });
  return { message: "Associado desativado com sucesso." };
};
