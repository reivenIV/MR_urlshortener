-- CreateTable
CREATE TABLE "folders_urls" (
    "folder_id" INTEGER NOT NULL,
    "url_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folders_urls_pkey" PRIMARY KEY ("folder_id","url_id")
);

-- CreateTable
CREATE TABLE "tags_urls" (
    "url_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_urls_pkey" PRIMARY KEY ("url_id","tag_id")
);

-- CreateIndex
CREATE INDEX "folders_urls_url_id_idx" ON "folders_urls"("url_id");

-- CreateIndex
CREATE INDEX "tags_urls_tag_id_idx" ON "tags_urls"("tag_id");

-- AddForeignKey
ALTER TABLE "folders_urls" ADD CONSTRAINT "folders_urls_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders_urls" ADD CONSTRAINT "folders_urls_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_urls" ADD CONSTRAINT "tags_urls_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_urls" ADD CONSTRAINT "tags_urls_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
