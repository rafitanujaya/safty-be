-- CreateEnum
CREATE TYPE "ProtectionLevel" AS ENUM ('LIGHT', 'BALANCED', 'STRICT');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ScanResult" AS ENUM ('SAFE', 'SUSPICIOUS', 'DANGEROUS');

-- CreateEnum
CREATE TYPE "ThreatEventType" AS ENUM ('PHISHING_DETECTED', 'SHORTLINK_EXPANDED', 'SENSITIVE_FORM_BLOCKED', 'FILE_SCANNED', 'IMAGE_SCANNED', 'WARNING_SHOWN', 'EXTRA_PROTECTION_ACTIVATED');

-- CreateEnum
CREATE TYPE "ActionTaken" AS ENUM ('BLOCKED', 'WARNED', 'ALLOWED', 'SCANNED', 'CONTINUED_ANYWAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleAccount" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "google_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtectionSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webFraudEnabled" BOOLEAN NOT NULL DEFAULT true,
    "phishingDetectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "safeLinkPreviewEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sensitiveFormProtectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fileProtectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "imageScanEnabled" BOOLEAN NOT NULL DEFAULT false,
    "protectionLevel" "ProtectionLevel" NOT NULL DEFAULT 'BALANCED',
    "notificationStyle" TEXT NOT NULL DEFAULT 'MINIMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProtectionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" "ThreatEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "sourceUrl" TEXT,
    "domain" TEXT,
    "actionTaken" "ActionTaken" NOT NULL DEFAULT 'SCANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreatEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "scanResult" "ScanResult" NOT NULL DEFAULT 'SAFE',
    "detectedIssue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "imageType" TEXT,
    "scanType" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "result" "ScanResult" NOT NULL DEFAULT 'SAFE',
    "manipulationIndicator" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScamEducationContent" (
    "id" TEXT NOT NULL,
    "scamCategory" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "whyRisky" TEXT,
    "howToAvoid" TEXT,
    "relatedEventType" "ThreatEventType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScamEducationContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccount_user_id_key" ON "GoogleAccount"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccount_google_user_id_key" ON "GoogleAccount"("google_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccount_email_key" ON "GoogleAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProtectionSettings_userId_key" ON "ProtectionSettings"("userId");

-- CreateIndex
CREATE INDEX "ThreatEvent_userId_idx" ON "ThreatEvent"("userId");

-- CreateIndex
CREATE INDEX "ThreatEvent_eventType_idx" ON "ThreatEvent"("eventType");

-- CreateIndex
CREATE INDEX "ThreatEvent_riskLevel_idx" ON "ThreatEvent"("riskLevel");

-- CreateIndex
CREATE INDEX "ThreatEvent_createdAt_idx" ON "ThreatEvent"("createdAt");

-- CreateIndex
CREATE INDEX "FileScan_userId_idx" ON "FileScan"("userId");

-- CreateIndex
CREATE INDEX "FileScan_scanResult_idx" ON "FileScan"("scanResult");

-- CreateIndex
CREATE INDEX "ImageScan_userId_idx" ON "ImageScan"("userId");

-- CreateIndex
CREATE INDEX "ImageScan_result_idx" ON "ImageScan"("result");

-- CreateIndex
CREATE INDEX "ScamEducationContent_scamCategory_idx" ON "ScamEducationContent"("scamCategory");

-- CreateIndex
CREATE INDEX "ScamEducationContent_relatedEventType_idx" ON "ScamEducationContent"("relatedEventType");

-- AddForeignKey
ALTER TABLE "GoogleAccount" ADD CONSTRAINT "GoogleAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionSettings" ADD CONSTRAINT "ProtectionSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatEvent" ADD CONSTRAINT "ThreatEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileScan" ADD CONSTRAINT "FileScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageScan" ADD CONSTRAINT "ImageScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
