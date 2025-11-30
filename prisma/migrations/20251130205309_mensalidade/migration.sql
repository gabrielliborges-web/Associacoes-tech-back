-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CREDITO', 'DEBITO', 'TRANSFERENCIA', 'BOLETO', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusMensalidade" AS ENUM ('ABERTA', 'PAGA', 'ATRASADA', 'ISENTA', 'CANCELADA');

-- CreateTable
CREATE TABLE "ConfigMensalidade" (
    "id" SERIAL NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "valorPadrao" DECIMAL(10,2) NOT NULL,
    "diaVencimento" INTEGER NOT NULL DEFAULT 10,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigMensalidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensalidadeAssociado" (
    "id" SERIAL NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "StatusMensalidade" NOT NULL DEFAULT 'ABERTA',
    "vencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "formaPagamento" "FormaPagamento",
    "comprovanteUrl" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MensalidadeAssociado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfigMensalidade_associacaoId_key" ON "ConfigMensalidade"("associacaoId");

-- CreateIndex
CREATE INDEX "MensalidadeAssociado_associacaoId_ano_mes_idx" ON "MensalidadeAssociado"("associacaoId", "ano", "mes");

-- CreateIndex
CREATE INDEX "MensalidadeAssociado_usuarioId_ano_mes_idx" ON "MensalidadeAssociado"("usuarioId", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "MensalidadeAssociado_associacaoId_usuarioId_ano_mes_key" ON "MensalidadeAssociado"("associacaoId", "usuarioId", "ano", "mes");

-- AddForeignKey
ALTER TABLE "ConfigMensalidade" ADD CONSTRAINT "ConfigMensalidade_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensalidadeAssociado" ADD CONSTRAINT "MensalidadeAssociado_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensalidadeAssociado" ADD CONSTRAINT "MensalidadeAssociado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
