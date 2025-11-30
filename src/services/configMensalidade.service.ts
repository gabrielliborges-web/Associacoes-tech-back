import { prisma } from "../config/prisma";

export const getConfigByAssociacao = async (associacaoId: number) => {
  const config = await prisma.configMensalidade.findUnique({
    where: { associacaoId },
  });
  return config;
};

export const upsertConfig = async (
  associacaoId: number,
  valorPadrao: string | number,
  diaVencimento: number,
  ativo = true
) => {
  const existing = await prisma.configMensalidade.findUnique({
    where: { associacaoId },
  });

  const data = {
    associacaoId,
    valorPadrao:
      typeof valorPadrao === "string" ? Number(valorPadrao) : valorPadrao,
    diaVencimento,
    ativo,
  } as any;

  if (existing) {
    return prisma.configMensalidade.update({ where: { associacaoId }, data });
  }

  return prisma.configMensalidade.create({ data });
};

export default { getConfigByAssociacao, upsertConfig };
