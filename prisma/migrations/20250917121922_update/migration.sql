-- DropForeignKey
ALTER TABLE "public"."UserDeviceToken" DROP CONSTRAINT "UserDeviceToken_userId_fkey";

-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "fcmToken" TEXT,
ALTER COLUMN "role" DROP DEFAULT;
