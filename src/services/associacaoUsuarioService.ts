import { prisma } from "../config/prisma";
import {
  CreateVinculoInput,
  UpdateVinculoInput,
} from "../validators/associacaoUsuario.schema";

export const createVinculo = async (
  associacaoId: number,
  data: CreateVinculoInput
) => {
  // garante que associação e usuário existam
  const associacao = await prisma.associacao.findUnique({
    where: { id: associacaoId },
  });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: data.usuarioId },
  });
  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // cria vínculo (unique usuarioId + associacaoId garantido pelo schema)
  try {
    const vinculo = await prisma.usuarioAssociacao.create({
      data: {
        usuarioId: data.usuarioId,
        associacaoId: associacaoId,
        perfil: data.perfil,
      },
      select: {
        id: true,
        usuarioId: true,
        associacaoId: true,
        perfil: true,
      },
    });

    return vinculo;
  } catch (err: any) {
    // conflito de vínculo existente
    if (err.code === "P2002") {
      const error: any = new Error(
        "Vínculo já existe para esse usuário e associação."
      );
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

export const listVinculos = async (associacaoId: number) => {
  const associacao = await prisma.associacao.findUnique({
    where: { id: associacaoId },
  });
  if (!associacao) {
    const error: any = new Error("Associação não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  return prisma.usuarioAssociacao.findMany({
    where: { associacaoId },
    include: {
      usuario: {
        select: { id: true, nome: true, email: true, role: true, ativo: true },
      },
    },
  });
};

export const updateVinculo = async (
  associacaoId: number,
  usuarioId: number,
  data: UpdateVinculoInput
) => {
  const vinculo = await prisma.usuarioAssociacao.findUnique({
    where: { usuarioId_associacaoId: { usuarioId, associacaoId } },
  });
  if (!vinculo) {
    const error: any = new Error("Vínculo não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  return prisma.usuarioAssociacao.update({
    where: { id: vinculo.id },
    data: { perfil: data.perfil },
    select: { id: true, usuarioId: true, associacaoId: true, perfil: true },
  });
};

export const deleteVinculo = async (
  associacaoId: number,
  usuarioId: number
) => {
  const vinculo = await prisma.usuarioAssociacao.findUnique({
    where: { usuarioId_associacaoId: { usuarioId, associacaoId } },
  });
  if (!vinculo) {
    const error: any = new Error("Vínculo não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.usuarioAssociacao.delete({ where: { id: vinculo.id } });
  return { message: "Vínculo removido com sucesso." };
};
