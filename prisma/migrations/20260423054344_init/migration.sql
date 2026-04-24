-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "pageUrl" TEXT,
    "domain" TEXT,
    "riskScore" INTEGER,
    "riskLevel" TEXT,
    "actionTaken" TEXT,
    "sourcePlatform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReason" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "reasonCode" TEXT,
    "reasonText" TEXT NOT NULL,
    "weight" INTEGER,

    CONSTRAINT "EventReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanRequest" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "resultJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "configJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceToken_key" ON "Device"("deviceToken");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReason" ADD CONSTRAINT "EventReason_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRequest" ADD CONSTRAINT "ScanRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
