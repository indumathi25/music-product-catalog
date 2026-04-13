/*
  Warnings:

  - A unique constraint covering the columns `[title,artist_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "artists_name_trgm_idx";

-- DropIndex
DROP INDEX "products_title_trgm_idx";

-- CreateIndex
CREATE UNIQUE INDEX "products_title_artist_id_key" ON "products"("title", "artist_id");
