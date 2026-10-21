-- DropForeignKey
ALTER TABLE "folders_urls" DROP CONSTRAINT "folders_urls_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders_urls" DROP CONSTRAINT "folders_urls_url_id_fkey";

-- DropTable
DROP TABLE "folders_urls";

-- DropTable
DROP TABLE "folders";
