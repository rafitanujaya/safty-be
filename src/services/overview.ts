import { prisma } from "../db/prisma";

function calculateProtectionScore(params: {
  highRiskCount: number;
  criticalRiskCount: number;
  totalEvents: number;
}) {
  const { highRiskCount, criticalRiskCount, totalEvents } = params;

  let score = 100;

  score -= highRiskCount * 4;
  score -= criticalRiskCount * 8;

  if (totalEvents === 0) {
    score = 95;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}

const getOverviewByUserId = async (userId: string) => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const settings = await prisma.protectionSettings.findUnique({
    where: {
      userId,
    },
  });

  const [
    totalEvents,
    totalThreatsBlocked,
    highRiskCount,
    criticalRiskCount,
    recentAlerts,
    weeklyEvents,
  ] = await Promise.all([
    prisma.threatEvent.count({
      where: {
        userId,
      },
    }),

    prisma.threatEvent.count({
      where: {
        userId,
        actionTaken: "BLOCKED",
      },
    }),

    prisma.threatEvent.count({
      where: {
        userId,
        riskLevel: "HIGH",
      },
    }),

    prisma.threatEvent.count({
      where: {
        userId,
        riskLevel: "CRITICAL",
      },
    }),

    prisma.threatEvent.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.threatEvent.findMany({
      where: {
        userId,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const protectionScore = calculateProtectionScore({
    highRiskCount,
    criticalRiskCount,
    totalEvents,
  });

  const activeProtectionModules = {
    webFraudProtection: settings?.webFraudEnabled ?? true,
    phishingDetection: settings?.phishingDetectionEnabled ?? true,
    safeLinkPreview: settings?.safeLinkPreviewEnabled ?? true,
    sensitiveFormProtection: settings?.sensitiveFormProtectionEnabled ?? true,
    fileProtection: settings?.fileProtectionEnabled ?? true,
    imageScan: settings?.imageScanEnabled ?? false,
  };

  const weeklyRiskSummary = {
    total: weeklyEvents.length,
    safe: weeklyEvents.filter((event) => event.riskLevel === "SAFE").length,
    low: weeklyEvents.filter((event) => event.riskLevel === "LOW").length,
    medium: weeklyEvents.filter((event) => event.riskLevel === "MEDIUM").length,
    high: weeklyEvents.filter((event) => event.riskLevel === "HIGH").length,
    critical: weeklyEvents.filter((event) => event.riskLevel === "CRITICAL")
      .length,
  };

  return {
    protectionScore,
    totalThreatsBlocked,
    recentAlerts,
    activeProtectionModules,
    weeklyRiskSummary,
  };
};

export { getOverviewByUserId };
