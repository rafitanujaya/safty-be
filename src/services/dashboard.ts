import { prisma } from "../db/prisma.js";
import { getDateRangeFromDays, formatDateKey } from "../utils/date";

export const getDashboardSummary = async (userId: string, days = 7) => {
  const { startDate } = getDateRangeFromDays(days);

  const totalThreatsBlocked = await prisma.threatEvent.count({
    where: { userId, actionTaken: "BLOCKED", createdAt: { gte: startDate } },
  });

  const phishingDetections = await prisma.threatEvent.count({
    where: { userId, eventType: "PHISHING_PREVENTED", createdAt: { gte: startDate } },
  });

  const maliciousActivity = await prisma.threatEvent.count({
    where: { userId, riskLevel: { in: ["HIGH", "CRITICAL"] }, createdAt: { gte: startDate } },
  });

  const suspiciousInteractions = await prisma.threatEvent.count({
    where: { userId, eventType: "SUSPICIOUS_INTERACTION", createdAt: { gte: startDate } },
  });

  return {
    totalThreatsBlocked,
    phishingDetections,
    maliciousActivity,
    suspiciousInteractions,
  };
};

export const getDashboardTrend = async (userId: string, days = 7) => {
  const { startDate } = getDateRangeFromDays(days);

  const events = await prisma.threatEvent.findMany({
    where: { userId, createdAt: { gte: startDate } },
    select: { createdAt: true, eventType: true, riskLevel: true },
  });

  const trendMap: Record<string, { phishing: number; malicious: number; suspicious: number }> = {};

  // Initialize empty days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trendMap[formatDateKey(d)] = { phishing: 0, malicious: 0, suspicious: 0 };
  }

  events.forEach((event: any) => {
    const dateKey = formatDateKey(event.createdAt);
    if (!trendMap[dateKey]) return;

    if (event.eventType === "PHISHING_PREVENTED") {
      trendMap[dateKey].phishing++;
    }
    if (event.riskLevel === "HIGH" || event.riskLevel === "CRITICAL") {
      trendMap[dateKey].malicious++;
    }
    if (event.eventType === "SUSPICIOUS_INTERACTION") {
      trendMap[dateKey].suspicious++;
    }
  });

  return Object.keys(trendMap)
    .sort()
    .map((date) => ({
      date,
      ...trendMap[date],
    }));
};

export const getDashboardSeverity = async (userId: string, days = 7) => {
  const { startDate } = getDateRangeFromDays(days);

  const severityGroup = await prisma.threatEvent.groupBy({
    by: ["riskLevel"],
    where: { userId, createdAt: { gte: startDate } },
    _count: true,
  });

  const result = [
    { name: "CRITICAL", value: 0 },
    { name: "HIGH", value: 0 },
    { name: "MEDIUM", value: 0 },
    { name: "LOW", value: 0 },
    { name: "SAFE", value: 0 },
  ];

  severityGroup.forEach((group: any) => {
    const item = result.find((r) => r.name === group.riskLevel);
    if (item) item.value = group._count;
  });

  return result;
};

export const getDashboardRecentEvents = async (userId: string, limit = 10) => {
  const events = await prisma.threatEvent.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { category: true, source: true },
  });

  return events.map((event: any) => ({
    ...event,
    category: event.category?.name || null,
    source: event.source?.domain || null,
  }));
};

export const getDashboardRiskLevel = async (userId: string, days = 7) => {
  const { startDate } = getDateRangeFromDays(days);

  const avgResult = await prisma.threatEvent.aggregate({
    where: { userId, createdAt: { gte: startDate } },
    _avg: { riskScore: true },
  });

  const averageRiskScore = avgResult._avg.riskScore || 0;
  
  let riskLevel = "SAFE";
  if (averageRiskScore > 80) riskLevel = "CRITICAL";
  else if (averageRiskScore > 60) riskLevel = "HIGH";
  else if (averageRiskScore > 40) riskLevel = "MEDIUM";
  else if (averageRiskScore > 20) riskLevel = "LOW";

  return { averageRiskScore, riskLevel };
};
