/*
  Warnings:

  - You are about to drop the column `author` on the `SOP` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `SOP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SOP" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SOP" ADD CONSTRAINT "SOP_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
