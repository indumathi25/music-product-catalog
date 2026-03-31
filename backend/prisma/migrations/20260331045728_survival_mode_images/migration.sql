-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_product_id_fkey";

-- DropIndex
DROP INDEX "artists_name_trgm_idx";

-- DropIndex
DROP INDEX "products_title_trgm_idx";

-- CreateIndex
CREATE INDEX "products_title_idx" ON "products"("title");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
