/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credentials_resetToken_key" ON "public"."credentials"("resetToken");
