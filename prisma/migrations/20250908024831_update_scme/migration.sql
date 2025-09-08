/*
  Warnings:

  - You are about to drop the column `Department` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `Institution` on the `credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "Department",
DROP COLUMN "Institution",
ADD COLUMN     "department" TEXT,
ADD COLUMN     "institution" TEXT;
