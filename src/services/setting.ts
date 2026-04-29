import { prisma } from "../db/prisma";
import { ProtectionLevel } from "@prisma/client";

type UpdateSettingsInput = {
  webFraudEnabled?: boolean;
  phishingDetectionEnabled?: boolean;
  safeLinkPreviewEnabled?: boolean;
  sensitiveFormProtectionEnabled?: boolean;
  fileProtectionEnabled?: boolean;
  imageScanEnabled?: boolean;
  protectionLevel?: ProtectionLevel;
  notificationStyle?: string;
};

const getOrCreateSettingsByUserId = async (userId: string) => {
  const existingSettings = await prisma.protectionSettings.findUnique({
    where: {
      userId,
    },
  });

  if (existingSettings) {
    return existingSettings;
  }

  return prisma.protectionSettings.create({
    data: {
      userId,
      webFraudEnabled: true,
      phishingDetectionEnabled: true,
      safeLinkPreviewEnabled: true,
      sensitiveFormProtectionEnabled: true,
      fileProtectionEnabled: true,
      imageScanEnabled: false,
      protectionLevel: "BALANCED",
      notificationStyle: "MINIMAL",
    },
  });
};

const updateSettingsByUserId = async (
  userId: string,
  input: UpdateSettingsInput,
) => {
  return prisma.protectionSettings.upsert({
    where: {
      userId,
    },
    update: {
      webFraudEnabled: input.webFraudEnabled,
      phishingDetectionEnabled: input.phishingDetectionEnabled,
      safeLinkPreviewEnabled: input.safeLinkPreviewEnabled,
      sensitiveFormProtectionEnabled: input.sensitiveFormProtectionEnabled,
      fileProtectionEnabled: input.fileProtectionEnabled,
      imageScanEnabled: input.imageScanEnabled,
      protectionLevel: input.protectionLevel,
      notificationStyle: input.notificationStyle,
    },
    create: {
      userId,
      webFraudEnabled: input.webFraudEnabled ?? true,
      phishingDetectionEnabled: input.phishingDetectionEnabled ?? true,
      safeLinkPreviewEnabled: input.safeLinkPreviewEnabled ?? true,
      sensitiveFormProtectionEnabled:
        input.sensitiveFormProtectionEnabled ?? true,
      fileProtectionEnabled: input.fileProtectionEnabled ?? true,
      imageScanEnabled: input.imageScanEnabled ?? false,
      protectionLevel: input.protectionLevel ?? "BALANCED",
      notificationStyle: input.notificationStyle ?? "MINIMAL",
    },
  });
};

export { getOrCreateSettingsByUserId, updateSettingsByUserId };
