/*
  Warnings:

  - You are about to drop the `UsuarioAssociacao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `associacaoId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMidia" AS ENUM ('FOTO', 'VIDEO');

-- DropForeignKey
ALTER TABLE "UsuarioAssociacao" DROP CONSTRAINT "UsuarioAssociacao_associacaoId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioAssociacao" DROP CONSTRAINT "UsuarioAssociacao_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "associacaoId" INTEGER NOT NULL,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "perfilAssociacao" "PerfilAssociacao" NOT NULL DEFAULT 'SOCIO';

-- DropTable
DROP TABLE "UsuarioAssociacao";

-- CreateTable
CREATE TABLE "MidiaJogo" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" "TipoMidia" NOT NULL DEFAULT 'FOTO',
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MidiaJogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galeria" (
    "id" SERIAL NOT NULL,
    "associacaoId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataEvento" TIMESTAMP(3),
    "capaUrl" TEXT,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MidiaGaleria" (
    "id" SERIAL NOT NULL,
    "galeriaId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" "TipoMidia" NOT NULL DEFAULT 'FOTO',
    "descricao" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MidiaGaleria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MidiaJogo_jogoId_idx" ON "MidiaJogo"("jogoId");

-- CreateIndex
CREATE INDEX "Galeria_associacaoId_idx" ON "Galeria"("associacaoId");

-- CreateIndex
CREATE INDEX "MidiaGaleria_galeriaId_idx" ON "MidiaGaleria"("galeriaId");

-- CreateIndex
CREATE INDEX "Usuario_associacaoId_idx" ON "Usuario"("associacaoId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MidiaJogo" ADD CONSTRAINT "MidiaJogo_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_associacaoId_fkey" FOREIGN KEY ("associacaoId") REFERENCES "Associacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MidiaGaleria" ADD CONSTRAINT "MidiaGaleria_galeriaId_fkey" FOREIGN KEY ("galeriaId") REFERENCES "Galeria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
