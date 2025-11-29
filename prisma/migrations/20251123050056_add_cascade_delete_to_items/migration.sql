-- DropForeignKey
ALTER TABLE "ItemCompra" DROP CONSTRAINT "ItemCompra_compraId_fkey";

-- DropForeignKey
ALTER TABLE "ItemVenda" DROP CONSTRAINT "ItemVenda_vendaId_fkey";

-- AddForeignKey
ALTER TABLE "ItemVenda" ADD CONSTRAINT "ItemVenda_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCompra" ADD CONSTRAINT "ItemCompra_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
