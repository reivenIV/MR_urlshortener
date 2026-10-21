-- AlterTable
ALTER TABLE "folders_urls" DROP CONSTRAINT "folders_urls_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "folders_urls_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "folders_urls_folder_id_url_id_key" ON "folders_urls"("folder_id", "url_id");

-- AlterTable
ALTER TABLE "tags_urls" DROP CONSTRAINT "tags_urls_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tags_urls_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_urls_url_id_tag_id_key" ON "tags_urls"("url_id", "tag_id");
