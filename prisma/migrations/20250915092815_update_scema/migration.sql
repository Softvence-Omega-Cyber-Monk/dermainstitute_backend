-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'TRAINEE', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."Situation" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Complete', 'Submitted');

-- CreateEnum
CREATE TYPE "public"."SOPStatus" AS ENUM ('Procedure', 'Emergence');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('High_Priority', 'Medium_Priority', 'Low_Priority');

-- CreateEnum
CREATE TYPE "public"."isDraft" AS ENUM ('isDraft', 'Published');

-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'TRAINEE',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "institution" TEXT,
    "department" TEXT,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetToken" INTEGER,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "image" TEXT,
    "verificationToken" TEXT,
    "verificationTokenExpiresAt" TIMESTAMP(3),

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medicine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IncidentReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "incidentTitle" TEXT NOT NULL,
    "procedure" TEXT,
    "severity" TEXT,
    "patientAge" INTEGER,
    "patientSex" TEXT,
    "descriptionOfIncident" TEXT NOT NULL,
    "situation" "public"."Situation" NOT NULL,
    "actionsTaken" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "lessonsLearned" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."Status" NOT NULL DEFAULT 'Submitted',

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SOP" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jurisdiction" TEXT[],
    "tags" TEXT[],
    "overview" TEXT NOT NULL,
    "indications" TEXT[],
    "contraindications" TEXT[],
    "required_equipment" TEXT[],
    "status" "public"."SOPStatus" NOT NULL DEFAULT 'Procedure',
    "isDraft" "public"."isDraft" NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'Medium_Priority',

    CONSTRAINT "SOP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProtocolStep" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "ProtocolStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "repeat" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Oxygen" (
    "id" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "repeat" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "Oxygen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "public"."credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_phone_key" ON "public"."credentials"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_resetToken_key" ON "public"."credentials"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_verificationToken_key" ON "public"."credentials"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Oxygen_sopId_key" ON "public"."Oxygen"("sopId");

-- AddForeignKey
ALTER TABLE "public"."ProtocolStep" ADD CONSTRAINT "ProtocolStep_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medication" ADD CONSTRAINT "Medication_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Oxygen" ADD CONSTRAINT "Oxygen_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
