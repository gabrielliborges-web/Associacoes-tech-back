import { prisma } from "../config/prisma";
import { UpdateConfiguracaoInput } from "../validators/configuracao.schema";

/**
 * Garante que existe uma configuração no banco
 * Se não existir, cria com valores padrão
 */
export const ensureConfiguracaoExiste = async () => {
  const configuracao = await prisma.configuracao.findFirst();

  if (!configuracao) {
    const novaConfiguracao = await prisma.configuracao.create({
      data: {
        saldoInicial: 0,
        mesAtual: new Date().getMonth() + 1,
      },
    });
    return novaConfiguracao;
  }

  return configuracao;
};

/**
 * Obtém a configuração atual (ou cria se não existir)
 */
export const getConfiguracao = async () => {
  const configuracao = await ensureConfiguracaoExiste();

  return {
    saldoInicial: configuracao.saldoInicial
      ? parseFloat(configuracao.saldoInicial.toString())
      : 0,
    mesAtual: configuracao.mesAtual,
    criadoEm: configuracao.criadoEm,
  };
};

/**
 * Atualiza a configuração (saldo inicial e/ou mês atual)
 */
export const updateConfiguracao = async (data: UpdateConfiguracaoInput) => {
  // Validar saldoInicial
  if (data.saldoInicial !== undefined && data.saldoInicial < 0) {
    const error = new Error("Saldo inicial não pode ser negativo.");
    (error as any).statusCode = 400;
    throw error;
  }

  // Validar mesAtual
  if (data.mesAtual !== undefined) {
    if (data.mesAtual < 1 || data.mesAtual > 12) {
      const error = new Error("Mês deve estar entre 1 e 12.");
      (error as any).statusCode = 400;
      throw error;
    }
  }

  // Garantir que configuração existe
  await ensureConfiguracaoExiste();

  // Atualizar a configuração
  const configuracao = await prisma.configuracao.updateMany({
    data: {
      ...(data.saldoInicial !== undefined && {
        saldoInicial: parseFloat(data.saldoInicial.toFixed(2)),
      }),
      ...(data.mesAtual !== undefined && { mesAtual: data.mesAtual }),
    },
  });

  // Buscar e retornar a configuração atualizada
  const configAtualizada = await prisma.configuracao.findFirst();

  if (!configAtualizada) {
    const error = new Error("Erro ao atualizar configuração.");
    (error as any).statusCode = 500;
    throw error;
  }

  return {
    saldoInicial: configAtualizada.saldoInicial
      ? parseFloat(configAtualizada.saldoInicial.toString())
      : 0,
    mesAtual: configAtualizada.mesAtual,
    criadoEm: configAtualizada.criadoEm,
  };
};
