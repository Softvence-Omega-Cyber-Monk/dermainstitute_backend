-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('High_Priority', 'Medium_Priority', 'Low_Priority');

-- AlterTable
ALTER TABLE "public"."SOP" ADD COLUMN     "priority" "public"."Priority";
