-- AlterTable
ALTER TABLE "Associacao" ADD COLUMN     "horarioPadraoFim" TEXT,
ADD COLUMN     "horarioPadraoInicio" TEXT,
ADD COLUMN     "regrasInternas" TEXT,
ADD COLUMN     "tipoJogoPadrao" "TipoJogo" DEFAULT 'BABA';
