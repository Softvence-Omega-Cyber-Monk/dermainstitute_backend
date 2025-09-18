-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "emargencyAlert" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT true;
