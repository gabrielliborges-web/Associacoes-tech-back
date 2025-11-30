import { prisma } from "../config/prisma";

export const gerarMensalidadesAno = async (
  associacaoId: number,
  ano: number
): Promise<void> => {
  const config = await prisma.configMensalidade.findUnique({
    where: { associacaoId },
  });

  if (!config) {
    const error: any = new Error(
      "Configuração de mensalidade não encontrada para a associação."
    );
    error.statusCode = 400;
    throw error;
  }

  const usuarios = await prisma.usuario.findMany({
    where: { associacaoId, ativo: true },
    select: { id: true },
  });

  const parcelas: Array<any> = [];

  for (const u of usuarios) {
    for (let mes = 1; mes <= 12; mes++) {
      const vencimento = new Date(ano, mes - 1, config.diaVencimento);
      parcelas.push({
        associacaoId,
        usuarioId: u.id,
        ano,
        mes,
        valor: config.valorPadrao as any,
        vencimento,
      });
    }
  }

  if (parcelas.length === 0) return;

  await prisma.mensalidadeAssociado.createMany({
    data: parcelas,
    skipDuplicates: true,
  });
};

export const listarMensalidadesUsuario = async (
  associacaoId: number,
  usuarioId: number,
  ano: number
) => {
  const count = await prisma.mensalidadeAssociado.count({
    where: { associacaoId, ano },
  });

  if (count === 0) {
    await gerarMensalidadesAno(associacaoId, ano);
  }

  const mensalidades = await prisma.mensalidadeAssociado.findMany({
    where: { associacaoId, usuarioId, ano },
    orderBy: { mes: "asc" },
  });

  return mensalidades;
};

export const listarMensalidadesUsuarioAdmin = async (
  associacaoId: number,
  usuarioId: number,
  ano: number
) => {
  const count = await prisma.mensalidadeAssociado.count({
    where: { associacaoId, ano },
  });

  if (count === 0) {
    await gerarMensalidadesAno(associacaoId, ano);
  }

  const mensalidades = await prisma.mensalidadeAssociado.findMany({
    where: { associacaoId, usuarioId, ano },
    orderBy: { mes: "asc" },
  });

  return mensalidades;
};

export const listarMensalidadesAssociacao = async (
  associacaoId: number,
  ano: number
) => {
  // Verifica se todos os usuários ativos têm mensalidades para o ano;
  // se algum estiver faltando, gera as mensalidades (geração é idempotente graças a skipDuplicates).
  const activeUsers = await prisma.usuario.findMany({
    where: { associacaoId, ativo: true, perfilAssociacao: "ASSOCIADO" },
    select: { id: true },
  });

  const mensalidadesUsuarios = await prisma.mensalidadeAssociado.findMany({
    where: { associacaoId, ano },
    select: { usuarioId: true },
  });

  const uniqueUsuarioIds = Array.from(
    new Set(mensalidadesUsuarios.map((m) => m.usuarioId))
  );
  const activeUsuarioIds = activeUsers.map((u) => u.id);

  if (uniqueUsuarioIds.length < activeUsuarioIds.length) {
    await gerarMensalidadesAno(associacaoId, ano);
  }

  const mensalidades = await prisma.mensalidadeAssociado.findMany({
    where: { associacaoId, ano },
    orderBy: { mes: "asc" },
    include: { usuario: true },
  });

  return mensalidades;
};

export const pagarMensalidade = async (
  id: number,
  associacaoId: number,
  payload: {
    dataPagamento?: string | Date;
    valorPago?: number;
    formaPagamento?: string;
    comprovanteUrl?: string;
    observacoes?: string;
  }
) => {
  const mensalidade = await prisma.mensalidadeAssociado.findUnique({
    where: { id },
  });

  if (!mensalidade) {
    const error: any = new Error("Mensalidade não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  if (mensalidade.associacaoId !== associacaoId) {
    const error: any = new Error(
      "Mensalidade não pertence à associação do usuário autenticado."
    );
    error.statusCode = 403;
    throw error;
  }

  const updated = await prisma.mensalidadeAssociado.update({
    where: { id },
    data: {
      status: "PAGA",
      dataPagamento: payload.dataPagamento
        ? new Date(payload.dataPagamento)
        : new Date(),
      formaPagamento: payload.formaPagamento as any,
      comprovanteUrl: payload.comprovanteUrl,
      observacoes: payload.observacoes,
    },
  });

  return updated;
};

export default {
  gerarMensalidadesAno,
  listarMensalidadesUsuario,
  listarMensalidadesUsuarioAdmin,
  listarMensalidadesAssociacao,
  pagarMensalidade,
};
