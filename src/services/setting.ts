import { prisma } from "../db/prisma.js";

export const getSettings = async (userId: string) => {
  let settings = await prisma.protectionSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.protectionSettings.create({
      data: { userId },
    });
  }

  return {
    realtimeProtection: settings.realtimeProtection,
    formBlocking: settings.formBlocking,
    downloadScanning: settings.downloadScanning,
    trackerBlocking: settings.trackerBlocking,
    redirectProtection: settings.redirectProtection,
    riskThreshold: settings.riskThreshold,
    themePreference: settings.themePreference,
  };
};

export const updateSettings = async (userId: string, data: any) => {
  const {
    realtimeProtection,
    formBlocking,
    downloadScanning,
    trackerBlocking,
    redirectProtection,
    riskThreshold,
    themePreference,
  } = data;

  const updateData: any = {};

  if (realtimeProtection !== undefined) updateData.realtimeProtection = realtimeProtection;
  if (formBlocking !== undefined) updateData.formBlocking = formBlocking;
  if (downloadScanning !== undefined) updateData.downloadScanning = downloadScanning;
  if (trackerBlocking !== undefined) updateData.trackerBlocking = trackerBlocking;
  if (redirectProtection !== undefined) updateData.redirectProtection = redirectProtection;
  if (riskThreshold !== undefined) updateData.riskThreshold = riskThreshold;
  if (themePreference !== undefined) updateData.themePreference = themePreference;

  const updated = await prisma.protectionSettings.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      ...updateData
    }
  });

  return {
    realtimeProtection: updated.realtimeProtection,
    formBlocking: updated.formBlocking,
    downloadScanning: updated.downloadScanning,
    trackerBlocking: updated.trackerBlocking,
    redirectProtection: updated.redirectProtection,
    riskThreshold: updated.riskThreshold,
    themePreference: updated.themePreference,
  };
};
