-- AlterTable
ALTER TABLE "public"."Page" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content" SET DATA TYPE TEXT;
