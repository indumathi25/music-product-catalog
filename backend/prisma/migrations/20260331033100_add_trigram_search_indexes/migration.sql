CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP INDEX IF EXISTS "products_title_idx";

CREATE INDEX "products_title_trgm_idx"
    ON "products" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "artists_name_trgm_idx"
    ON "artists" USING GIN ("name" gin_trgm_ops);
