/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_verificationToken_key" ON "public"."credentials"("verificationToken");
