import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, UpdateUserInput } from "../validators/user.schema";

// Remove senha do objeto a ser retornado
const sanitize = (usuario: any) => {
  if (!usuario) return usuario;
  const { senha, ...rest } = usuario;
  return rest;
};

export const listUsuarios = async (ativo?: boolean) => {
  const where: any = {};
  if (ativo !== undefined) where.ativo = ativo;

  const usuarios = await prisma.usuario.findMany({
    where,
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      theme: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return usuarios;
};

export const getUsuarioById = async (id: number) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      theme: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

export const createUsuario = async (data: CreateUserInput) => {
  // Verifica email
  const existing = await prisma.usuario.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    const error: any = new Error("E-mail já cadastrado.");
    error.statusCode = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: hashed,
      role: data.role,
      theme: data.theme,
      ativo: data.ativo,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      theme: true,
      ativo: true,
      criadoEm: true,
    },
  });

  return usuario;
};

export const updateUsuario = async (id: number, data: UpdateUserInput) => {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  if (data.email && data.email !== usuario.email) {
    const existing = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      const error: any = new Error("E-mail já cadastrado.");
      error.statusCode = 409;
      throw error;
    }
  }

  const updated = await prisma.usuario.update({
    where: { id },
    data: {
      ...(data.nome && { nome: data.nome }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
      ...(data.theme && { theme: data.theme }),
      ...(data.ativo !== undefined && { ativo: data.ativo }),
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      theme: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return updated;
};

// Desativação lógica do usuário
export const deactivateUsuario = async (id: number) => {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.usuario.update({ where: { id }, data: { ativo: false } });

  return { message: "Usuário desativado com sucesso." };
};
