import { transporter } from "../config/nodemailer/nodemailer";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
};

export const sendResetCode = async (email: string) => {
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    const err: any = new Error("Usuário não encontrado.");
    err.statusCode = 404;
    throw err;
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await prisma.passwordReset.upsert({
    where: { email },
    update: {
      code,
      expiresAt,
      used: false,
    },
    create: {
      email,
      code,
      expiresAt,
    },
  });

  await transporter.sendMail({
    from: `"Suporte - Movie App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Código de Redefinição de Senha",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #521A95; text-align: center;">Redefinição de Senha</h2>
        <p>Use o código abaixo para redefinir sua senha. Ele expira em <strong>10 minutos</strong>.</p>
        <div style="background:#521A95;color:#fff;font-size:24px;font-weight:bold;text-align:center;padding:12px;border-radius:8px;margin:16px 0;">
          ${code}
        </div>
        <p>Se você não solicitou esta ação, ignore este e-mail.</p>
      </div>
    `,
  });

  return { message: "Código de redefinição enviado com sucesso." };
};

export const validateResetCode = async (email: string, code: string) => {
  const record = await prisma.passwordReset.findFirst({
    where: { email, used: false },
  });

  if (!record) {
    const err: any = new Error("Código não encontrado.");
    err.statusCode = 404;
    throw err;
  }

  if (record.code !== code) {
    const err: any = new Error("Código inválido.");
    err.statusCode = 403;
    throw err;
  }

  if (record.expiresAt < new Date()) {
    const err: any = new Error("Código expirado.");
    err.statusCode = 410;
    throw err;
  }

  return { message: "Código validado com sucesso." };
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const record = await prisma.passwordReset.findFirst({
    where: { email, code, used: false },
  });

  if (!record) {
    const err: any = new Error("Código inválido ou já utilizado.");
    err.statusCode = 400;
    throw err;
  }

  if (record.expiresAt < new Date()) {
    const err: any = new Error("Código expirado.");
    err.statusCode = 410;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.usuario.update({
    where: { email },
    data: { senha: hashedPassword },
  });

  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  return { message: "Senha atualizada com sucesso." };
};
