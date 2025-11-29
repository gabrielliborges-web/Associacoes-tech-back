import bcrypt from "bcrypt";
import { signSession } from "../utils/jwt";
import { prisma } from "../config/prisma";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "../validators/auth.schema";

export const signup = async (data: SignupInput) => {
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
      theme: data.theme as "DARK" | "LIGHT",
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
};

export const login = async (data: LoginInput) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email: data.email },
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

  const { senha, ...usuarioSemSenha } = usuario;
  return { usuario: usuarioSemSenha, token };
};
