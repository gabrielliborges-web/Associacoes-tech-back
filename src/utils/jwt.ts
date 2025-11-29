import jwt from "jsonwebtoken";
import { env } from "../config/env";

type Payload = {
  id: number;
  nome: string;
  email: string;
  role: string;
  associacaoId?: number;
};

export function signSession(
  userId: number,
  nome: string,
  email: string,
  role: string = "USER",
  associacaoId?: number
) {
  return jwt.sign(
    { id: userId, nome, email, role, associacaoId } as Payload,
    env.JWT_SECRET,
    {
      expiresIn: `${env.SESSION_EXPIRES_DAYS}d`,
    }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as Payload;
}
