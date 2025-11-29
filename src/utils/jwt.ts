import jwt from "jsonwebtoken";
import { env } from "../config/env";

type Payload = { id: number; nome: string; email: string; role: string };

export function signSession(
  userId: number,
  nome: string,
  email: string,
  role: string = "USER"
) {
  return jwt.sign(
    { id: userId, nome, email, role } as Payload,
    env.JWT_SECRET,
    {
      expiresIn: `${env.SESSION_EXPIRES_DAYS}d`,
    }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as Payload;
}
