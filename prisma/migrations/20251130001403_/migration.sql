/*
  Warnings:

  - The values [SOCIO] on the enum `PerfilAssociacao` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `associadoId` on the `JogadorJogo` table. All the data in the column will be lost.
  - You are about to drop the column `associadoId` on the `PresencaJogo` table. All the data in the column will be lost.
  - You are about to drop the `Associado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jogoId,usuarioId]` on the table `PresencaJogo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `JogadorJogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `PresencaJogo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PerfilAssociacao_new" AS ENUM ('ASSOCIADO', 'DIRETOR', 'TECNICO', 'ADMINISTRADOR');
ALTER TABLE "Usuario" ALTER COLUMN "perfilAssociacao" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "perfilAssociacao" TYPE "PerfilAssociacao_new" USING ("perfilAssociacao"::text::"PerfilAssociacao_new");
ALTER TYPE "PerfilAssociacao" RENAME TO "PerfilAssociacao_old";
ALTER TYPE "PerfilAssociacao_new" RENAME TO "PerfilAssociacao";
DROP TYPE "PerfilAssociacao_old";
ALTER TABLE "Usuario" ALTER COLUMN "perfilAssociacao" SET DEFAULT 'ASSOCIADO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Associado" DROP CONSTRAINT "Associado_associacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Associado" DROP CONSTRAINT "Associado_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "JogadorJogo" DROP CONSTRAINT "JogadorJogo_associadoId_fkey";

-- DropForeignKey
ALTER TABLE "PresencaJogo" DROP CONSTRAINT "PresencaJogo_associadoId_fkey";

-- DropIndex
DROP INDEX "Cartao_jogadorJogoId_idx";

-- DropIndex
DROP INDEX "Cartao_jogoId_idx";

-- DropIndex
DROP INDEX "Galeria_associacaoId_idx";

-- DropIndex
DROP INDEX "Gol_jogadorJogoId_idx";

-- DropIndex
DROP INDEX "Gol_jogoId_idx";

-- DropIndex
DROP INDEX "Gol_timeJogoId_idx";

-- DropIndex
DROP INDEX "JogadorJogo_associadoId_idx";

-- DropIndex
DROP INDEX "MidiaGaleria_galeriaId_idx";

-- DropIndex
DROP INDEX "MidiaJogo_jogoId_idx";

-- DropIndex
DROP INDEX "PresencaJogo_associadoId_idx";

-- DropIndex
DROP INDEX "PresencaJogo_jogoId_associadoId_key";

-- DropIndex
DROP INDEX "PresencaJogo_jogoId_idx";

-- AlterTable
ALTER TABLE "JogadorJogo" DROP COLUMN "associadoId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PresencaJogo" DROP COLUMN "associadoId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "apelido" TEXT,
ADD COLUMN     "dataEntrada" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "numeroCamisaPadrao" INTEGER,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "pernaDominante" "PernaDominante",
ADD COLUMN     "posicaoPreferida" "Posicao",
ADD COLUMN     "telefone" TEXT,
ALTER COLUMN "perfilAssociacao" SET DEFAULT 'ASSOCIADO';

-- DropTable
DROP TABLE "Associado";

-- DropTable
DROP TABLE "PasswordReset";

-- CreateIndex
CREATE INDEX "JogadorJogo_usuarioId_idx" ON "JogadorJogo"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "PresencaJogo_jogoId_usuarioId_key" ON "PresencaJogo"("jogoId", "usuarioId");

-- AddForeignKey
ALTER TABLE "JogadorJogo" ADD CONSTRAINT "JogadorJogo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresencaJogo" ADD CONSTRAINT "PresencaJogo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
