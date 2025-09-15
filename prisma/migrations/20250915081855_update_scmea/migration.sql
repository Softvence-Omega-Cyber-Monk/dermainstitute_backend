/*
  Warnings:

  - You are about to drop the column `maxValue` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `minValue` on the `Medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Medicine" DROP COLUMN "maxValue",
DROP COLUMN "minValue",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
