import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import {
  CreateUserInput,
  UpdateUserInput,
  UpdatePasswordInput,
} from "../validators/user.schema";

// Função auxiliar para remover senha do usuário
const excludePassword = (usuario: any) => {
  const { senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
};

/**
 * Lista todos os usuários (sem retornar senha)
 */
export const listUsers = async () => {
  const usuarios = await prisma.usuario.findMany({
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

  return usuarios;
};

/**
 * Obtém um usuário pelo ID
 */
export const getUserById = async (id: number) => {
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
    },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

/**
 * Cria um novo usuário (por admin/superadmin)
 */
export const createUser = async (data: CreateUserInput) => {
  // Verifica se email já existe
  const existingUser = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error: any = new Error("E-mail já cadastrado.");
    error.statusCode = 409;
    throw error;
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(data.senha, 10);

  // Cria usuário
  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: hashedPassword,
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

/**
 * Atualiza dados do usuário
 */
export const updateUser = async (id: number, data: UpdateUserInput) => {
  // Verifica se usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Se o email está sendo alterado, verifica se já existe
  if (data.email && data.email !== usuario.email) {
    const existingEmail = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      const error: any = new Error("E-mail já cadastrado.");
      error.statusCode = 409;
      throw error;
    }
  }

  // Atualiza usuário
  const usuarioAtualizado = await prisma.usuario.update({
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
    },
  });

  return usuarioAtualizado;
};

/**
 * Atualiza o tema do usuário
 */
export const updateTheme = async (id: number, theme: "LIGHT" | "DARK") => {
  // Verifica se usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Atualiza tema
  const usuarioAtualizado = await prisma.usuario.update({
    where: { id },
    data: { theme },
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

  return usuarioAtualizado;
};

/**
 * Atualiza a senha do usuário
 */
export const updatePassword = async (id: number, data: UpdatePasswordInput) => {
  // Verifica se usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Verifica se senha antiga está correta
  const senhaValida = await bcrypt.compare(data.oldPassword, usuario.senha);

  if (!senhaValida) {
    const error: any = new Error("Senha atual incorreta.");
    error.statusCode = 401;
    throw error;
  }

  // Hash da nova senha
  const novaSenhaHash = await bcrypt.hash(data.newPassword, 10);

  // Atualiza senha
  await prisma.usuario.update({
    where: { id },
    data: { senha: novaSenhaHash },
  });

  return { message: "Senha atualizada com sucesso." };
};

/**
 * Deleta um usuário (soft delete: marca como inativo ou remove completamente)
 */
export const deleteUser = async (id: number) => {
  // Verifica se usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Remove usuário (hard delete)
  await prisma.usuario.delete({
    where: { id },
  });

  return { message: "Usuário deletado com sucesso." };
};

/**
 * Obtém perfil do usuário (para middlewares de autenticação)
 */
export const getProfile = async (userId?: number) => {
  if (!userId) {
    const error: any = new Error("Usuário não autenticado.");
    error.statusCode = 401;
    throw error;
  }

  return getUserById(userId);
};
