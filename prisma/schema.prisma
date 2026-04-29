// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id             String          @id @default(cuid())
  username       String
  email          String          @unique
  avatar_url     String?
  password       String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  googleAccounts GoogleAccount[]
  settings            ProtectionSettings?
  threatEvents        ThreatEvent[]
  fileScans           FileScan[]
  imageScans          ImageScan[]
}

model GoogleAccount {
  id             String   @id @default(cuid())
  user_id        String   @unique
  google_user_id String   @unique
  email          String   @unique
  name           String
  avatar_url     String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [user_id], references: [id])
}

enum ProtectionLevel {
  LIGHT
  BALANCED
  STRICT
}

enum RiskLevel {
  SAFE
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ScanResult {
  SAFE
  SUSPICIOUS
  DANGEROUS
}

enum ThreatEventType {
  PHISHING_DETECTED
  SHORTLINK_EXPANDED
  SENSITIVE_FORM_BLOCKED
  FILE_SCANNED
  IMAGE_SCANNED
  WARNING_SHOWN
  EXTRA_PROTECTION_ACTIVATED
}

enum ActionTaken {
  BLOCKED
  WARNED
  ALLOWED
  SCANNED
  CONTINUED_ANYWAY
}

model ProtectionSettings {
  id                              String            @id @default(uuid())
  userId                          String            @unique

  webFraudEnabled                 Boolean           @default(true)
  phishingDetectionEnabled        Boolean           @default(true)
  safeLinkPreviewEnabled          Boolean           @default(true)
  sensitiveFormProtectionEnabled  Boolean           @default(true)
  fileProtectionEnabled           Boolean           @default(true)
  imageScanEnabled                Boolean           @default(false)

  protectionLevel                 ProtectionLevel   @default(BALANCED)
  notificationStyle               String            @default("MINIMAL")

  createdAt                       DateTime          @default(now())
  updatedAt                       DateTime          @updatedAt

  user                            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ThreatEvent {
  id              String           @id @default(uuid())
  userId          String

  eventType       ThreatEventType
  title           String
  description     String?
  riskLevel       RiskLevel        @default(LOW)
  riskScore       Int              @default(0)

  reason          String?
  sourceUrl       String?
  domain          String?
  actionTaken     ActionTaken      @default(SCANNED)

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([eventType])
  @@index([riskLevel])
  @@index([createdAt])
}

model FileScan {
  id              String       @id @default(uuid())
  userId          String

  fileName        String
  fileType        String?
  fileSize        Int?
  riskScore       Int          @default(0)
  scanResult      ScanResult   @default(SAFE)
  detectedIssue   String?

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([scanResult])
}

model ImageScan {
  id                      String       @id @default(uuid())
  userId                  String

  imageName               String
  imageType               String?
  scanType                String?
  riskScore               Int          @default(0)
  result                  ScanResult   @default(SAFE)
  manipulationIndicator   String?

  createdAt               DateTime     @default(now())
  updatedAt               DateTime     @updatedAt

  user                    User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([result])
}

model ScamEducationContent {
  id                String            @id @default(uuid())

  scamCategory      String
  title             String
  summary           String?
  whyRisky          String?
  howToAvoid        String?
  relatedEventType  ThreatEventType?

  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([scamCategory])
  @@index([relatedEventType])
}