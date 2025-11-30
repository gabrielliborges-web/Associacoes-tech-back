import { prisma } from "../config/prisma";
import {
  CreateAssociadoInput,
  UpdateAssociadoInput,
} from "../validators/associado.schema";
import bcrypt from "bcrypt";

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

  // Verificar se email já existe
  if (data.email) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      const error: any = new Error("E-mail já cadastrado.");
      error.statusCode = 400;
      throw error;
    }
  }

  // Gerar senha padrão se não fornecida
  const senhaPadrao = data.email ? "123456" : ""; // Senha temporária
  const hashedPassword = senhaPadrao ? await bcrypt.hash(senhaPadrao, 10) : "";

  const associado = await prisma.usuario.create({
    data: {
      associacaoId,
      nome: data.nome,
      email: data.email || "",
      senha: hashedPassword,
      perfilAssociacao: "ASSOCIADO",
      apelido: data.apelido,
      dataNascimento: data.dataNascimento
        ? new Date(data.dataNascimento)
        : null,
      telefone: data.telefone,
      avatarUrl: data.fotoUrl,
      numeroCamisaPadrao: data.numeroCamisaPadrao,
      posicaoPreferida: data.posicaoPreferida as any,
      pernaDominante: data.pernaDominante as any,
      ativo: data.ativo ?? true,
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

  return prisma.usuario.findMany({
    where: {
      associacaoId,
      perfilAssociacao: "ASSOCIADO",
    },
  });
};

export const getAssociadoById = async (id: number) => {
  const associado = await prisma.usuario.findUnique({
    where: { id },
    include: {
      associacao: true,
    },
  });
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
  const associado = await prisma.usuario.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Verificar se email já existe (se estiver sendo alterado)
  if (data.email && data.email !== associado.email) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      const error: any = new Error("E-mail já cadastrado.");
      error.statusCode = 400;
      throw error;
    }
  }

  const updated = await prisma.usuario.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.apelido !== undefined && { apelido: data.apelido }),
      ...(data.dataNascimento && {
        dataNascimento: new Date(data.dataNascimento),
      }),
      ...(data.telefone !== undefined && { telefone: data.telefone }),
      ...(data.email && { email: data.email }),
      ...(data.fotoUrl !== undefined && { avatarUrl: data.fotoUrl }),
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
      ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
    },
  });

  return updated;
};

export const deactivateAssociado = async (id: number) => {
  const associado = await prisma.usuario.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.usuario.update({ where: { id }, data: { ativo: false } });
  return { message: "Associado desativado com sucesso." };
};

export const activateAssociado = async (id: number) => {
  const associado = await prisma.usuario.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.usuario.update({ where: { id }, data: { ativo: true } });
  return { message: "Associado ativado com sucesso." };
};

export const deleteAssociado = async (id: number) => {
  const associado = await prisma.usuario.findUnique({ where: { id } });
  if (!associado) {
    const error: any = new Error("Associado não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.usuario.delete({ where: { id } });
  return { message: "Associado excluído com sucesso." };
};
