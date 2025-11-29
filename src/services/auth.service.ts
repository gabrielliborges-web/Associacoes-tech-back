import bcrypt from "bcrypt";
import { signSession } from "../utils/jwt";
import { prisma } from "../config/prisma";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
  SignupPrimeiroUsuarioInput,
} from "../validators/auth.schema";

export const signupPrimeiroUsuario = async (
  data: SignupPrimeiroUsuarioInput
) => {
  // Verificar se o email já está cadastrado
  const existing = await prisma.usuario.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    const error: any = new Error("E-mail já cadastrado.");
    error.statusCode = 409;
    throw error;
  }

  // Hash da senha
  const hashed = await bcrypt.hash(data.senha, 10);

  // Criar associação e usuário master em transação
  const [associacao, usuario] = await prisma.$transaction(async (tx) => {
    // 1. Criar a associação
    const novaAssociacao = await tx.associacao.create({
      data: {
        nome: data.nomeAssociacao,
        apelido: data.apelidoAssociacao || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        ativa: true,
      },
    });

    // 2. Criar o usuário master vinculado à associação
    const novoUsuario = await tx.usuario.create({
      data: {
        nome: data.nomeUsuario,
        email: data.email,
        senha: hashed,
        theme: data.theme as "DARK" | "LIGHT",
        associacaoId: novaAssociacao.id,
        perfilAssociacao: "ADMINISTRADOR",
        role: "ADMIN",
        ativo: true,
      },
    });

    return [novaAssociacao, novoUsuario];
  });

  // Gerar token JWT
  const token = signSession(
    usuario.id,
    usuario.nome,
    usuario.email,
    usuario.role
  );

  // Remover senha do retorno
  const { senha, ...usuarioSemSenha } = usuario;

  return {
    token,
    usuario: usuarioSemSenha,
    associacao: {
      id: associacao.id,
      nome: associacao.nome,
      apelido: associacao.apelido,
      cidade: associacao.cidade,
      estado: associacao.estado,
      logoUrl: associacao.logoUrl,
    },
  };
};

export const signup = async (data: SignupInput) => {
  const existing = await prisma.usuario.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    const error: any = new Error("E-mail já cadastrado.");
    error.statusCode = 409;
    throw error;
  }

  // NOTA: Este endpoint antigo não deve ser usado mais para primeiro acesso.
  // Use signupPrimeiroUsuario para criar associação + usuário.
  // Este signup só funciona se você já tiver uma associação criada e passar associacaoId.

  const error: any = new Error(
    "Use o endpoint /auth/signup-primeiro-usuario para criar sua associação."
  );
  error.statusCode = 400;
  throw error;

  // Código antigo comentado:
  /*
  const hashed = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: hashed,
      theme: data.theme as "DARK" | "LIGHT",
      // associacaoId: ???  <- precisa de associacaoId
    },
  });

  const token = signSession(
    usuario.id,
    usuario.nome,
    usuario.email,
    usuario.role
  );

  // remove senha do retorno
  const { senha, ...usuarioSemSenha } = usuario;
  return { usuario: usuarioSemSenha, token };
  */
};

export const login = async (data: LoginInput) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email: data.email },
    include: {
      associacao: true, // Incluir dados da associação
    },
  });
  if (!usuario) {
    const error: any = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const valid = await bcrypt.compare(data.senha, usuario.senha);
  if (!valid) {
    const error: any = new Error("Senha incorreta.");
    error.statusCode = 401;
    throw error;
  }

  const token = signSession(
    usuario.id,
    usuario.nome,
    usuario.email,
    usuario.role
  );

  const { senha, associacao, ...usuarioSemSenha } = usuario;

  return {
    token,
    usuario: usuarioSemSenha,
    associacao: {
      id: associacao.id,
      nome: associacao.nome,
      apelido: associacao.apelido,
      cidade: associacao.cidade,
      estado: associacao.estado,
      logoUrl: associacao.logoUrl,
    },
  };
};
