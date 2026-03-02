-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover_art_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_name_key" ON "artists"("name");

-- CreateIndex
CREATE INDEX "products_artist_id_idx" ON "products"("artist_id");

-- CreateIndex
CREATE INDEX "products_title_idx" ON "products"("title");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
