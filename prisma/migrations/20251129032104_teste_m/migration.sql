/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Compra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Configuracao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Despesa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntradaFinanceira` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemCompra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemVenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovimentacaoFinanceira` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venda` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Posicao" AS ENUM ('GOLEIRO', 'ZAGUEIRO', 'LATERAL', 'VOLANTE', 'MEIA', 'ATACANTE');

-- CreateEnum
CREATE TYPE "PernaDominante" AS ENUM ('DIREITA', 'ESQUERDA', 'AMBIDESTRO');

-- CreateEnum
CREATE TYPE "TipoJogo" AS ENUM ('BABA', 'AMISTOSO', 'CAMPEONATO', 'TREINO');

-- CreateEnum
CREATE TYPE "TipoGol" AS ENUM ('NORMAL', 'PENALTI', 'FALTA', 'CONTRA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoCartao" AS ENUM ('AMARELO', 'VERMELHO');

-- CreateEnum
CREATE TYPE "LadoTime" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "PerfilAssociacao" AS ENUM ('SOCIO', 'DIRETOR', 'TECNICO', 'ADMINISTRADOR');

-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "EntradaFinanceira" DROP CONSTRAINT "EntradaFinanceira_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCompra" DROP CONSTRAINT "ItemCompra_compraId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCompra" DROP CONSTRAINT "ItemCompra_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVenda" DROP CONSTRAINT "ItemVenda_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVenda" DROP CONSTRAINT "ItemVenda_vendaId_fkey";

-- DropForeignKey
ALTER TABLE "MovimentacaoFinanceira" DROP CONSTRAINT "MovimentacaoFinanceira_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_usuarioId_fkey";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "Compra";

-- DropTable
DROP TABLE "Configuracao";

-- DropTable
DROP TABLE "Despesa";

-- DropTable
DROP TABLE "EntradaFinanceira";

-- DropTable
DROP TABLE "ItemCompra";

-- DropTable
DROP TABLE "ItemVenda";

-- DropTable
DROP TABLE "MovimentacaoFinanceira";

-- DropTable
DROP TABLE "Produto";

-- DropTable
DROP TABLE "Venda";

-- CreateTable
CREATE TABLE "Associacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "descricao" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "logoUrl" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Associacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Associado" (
    "id" SERIAL NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "email" TEXT,
    "fotoUrl" TEXT,
    "numeroCamisaPadrao" INTEGER,
    "posicaoPreferida" "Posicao",
    "pernaDominante" "PernaDominante",
    "dataEntrada" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "usuarioId" INTEGER,

    CONSTRAINT "Associado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioAssociacao" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "perfil" "PerfilAssociacao" NOT NULL DEFAULT 'SOCIO',

    CONSTRAINT "UsuarioAssociacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" SERIAL NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoJogo" NOT NULL DEFAULT 'BABA',
    "descricao" TEXT,
    "local" TEXT,
    "placarTimeA" INTEGER NOT NULL DEFAULT 0,
    "placarTimeB" INTEGER NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeJogo" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "corPrincipal" TEXT,
    "lado" "LadoTime" NOT NULL,

    CONSTRAINT "TimeJogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JogadorJogo" (
    "id" SERIAL NOT NULL,
    "timeJogoId" INTEGER NOT NULL,
    "associadoId" INTEGER NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT true,
    "numeroCamisa" INTEGER,
    "posicao" "Posicao",
    "observacoes" TEXT,

    CONSTRAINT "JogadorJogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gol" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "timeJogoId" INTEGER NOT NULL,
    "jogadorJogoId" INTEGER,
    "minuto" INTEGER,
    "tipo" "TipoGol" NOT NULL DEFAULT 'NORMAL',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cartao" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "jogadorJogoId" INTEGER NOT NULL,
    "minuto" INTEGER,
    "tipo" "TipoCartao" NOT NULL,
    "motivo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresencaJogo" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "associadoId" INTEGER NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,
    "chegouAtrasado" BOOLEAN DEFAULT false,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresencaJogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Associado_usuarioId_key" ON "Associado"("usuarioId");

-- CreateIndex
CREATE INDEX "Associado_associacaoId_idx" ON "Associado"("associacaoId");

-- CreateIndex
CREATE INDEX "UsuarioAssociacao_associacaoId_idx" ON "UsuarioAssociacao"("associacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioAssociacao_usuarioId_associacaoId_key" ON "UsuarioAssociacao"("usuarioId", "associacaoId");

-- CreateIndex
CREATE INDEX "Jogo_associacaoId_idx" ON "Jogo"("associacaoId");

-- CreateIndex
CREATE INDEX "Jogo_data_idx" ON "Jogo"("data");

-- CreateIndex
CREATE INDEX "TimeJogo_jogoId_idx" ON "TimeJogo"("jogoId");

-- CreateIndex
CREATE INDEX "JogadorJogo_timeJogoId_idx" ON "JogadorJogo"("timeJogoId");

-- CreateIndex
CREATE INDEX "JogadorJogo_associadoId_idx" ON "JogadorJogo"("associadoId");

-- CreateIndex
CREATE INDEX "Gol_jogoId_idx" ON "Gol"("jogoId");

-- CreateIndex
CREATE INDEX "Gol_timeJogoId_idx" ON "Gol"("timeJogoId");

-- CreateIndex
CREATE INDEX "Gol_jogadorJogoId_idx" ON "Gol"("jogadorJogoId");

-- CreateIndex
CREATE INDEX "Cartao_jogoId_idx" ON "Cartao"("jogoId");

-- CreateIndex
CREATE INDEX "Cartao_jogadorJogoId_idx" ON "Cartao"("jogadorJogoId");

-- CreateIndex
CREATE INDEX "PresencaJogo_jogoId_idx" ON "PresencaJogo"("jogoId");

-- CreateIndex
CREATE INDEX "PresencaJogo_associadoId_idx" ON "PresencaJogo"("associadoId");

-- CreateIndex
CREATE UNIQUE INDEX "PresencaJogo_jogoId_associadoId_key" ON "PresencaJogo"("jogoId", "associadoId");

-- AddForeignKey
ALTER TABLE "Associado" ADD CONSTRAINT "Associado_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Associado" ADD CONSTRAINT "Associado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioAssociacao" ADD CONSTRAINT "UsuarioAssociacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioAssociacao" ADD CONSTRAINT "UsuarioAssociacao_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeJogo" ADD CONSTRAINT "TimeJogo_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorJogo" ADD CONSTRAINT "JogadorJogo_timeJogoId_fkey" FOREIGN KEY ("timeJogoId") REFERENCES "TimeJogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorJogo" ADD CONSTRAINT "JogadorJogo_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES "Associado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_timeJogoId_fkey" FOREIGN KEY ("timeJogoId") REFERENCES "TimeJogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_jogadorJogoId_fkey" FOREIGN KEY ("jogadorJogoId") REFERENCES "JogadorJogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_jogadorJogoId_fkey" FOREIGN KEY ("jogadorJogoId") REFERENCES "JogadorJogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaJogo" ADD CONSTRAINT "PresencaJogo_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaJogo" ADD CONSTRAINT "PresencaJogo_associadoId_fkey" FOREIGN KEY ("associadoId") REFERENCES "Associado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
