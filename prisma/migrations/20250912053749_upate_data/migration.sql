/*
  Warnings:

  - Changed the type of `isDraft` on the `SOP` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."isDraft" AS ENUM ('isDraft', 'Published');

-- AlterTable
ALTER TABLE "public"."SOP" DROP COLUMN "isDraft",
ADD COLUMN     "isDraft" "public"."isDraft" NOT NULL;
