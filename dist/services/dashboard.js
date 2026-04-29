"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardRiskLevel = exports.getDashboardRecentEvents = exports.getDashboardSeverity = exports.getDashboardTrend = exports.getDashboardSummary = void 0;
const prisma_js_1 = require("../db/prisma.js");
const date_1 = require("../utils/date");
const getDashboardSummary = async (userId, days = 7) => {
    const { startDate } = (0, date_1.getDateRangeFromDays)(days);
    const totalThreatsBlocked = await prisma_js_1.prisma.threatEvent.count({
        where: { userId, actionTaken: "BLOCKED", createdAt: { gte: startDate } },
    });
    const phishingDetections = await prisma_js_1.prisma.threatEvent.count({
        where: { userId, eventType: "PHISHING_PREVENTED", createdAt: { gte: startDate } },
    });
    const maliciousActivity = await prisma_js_1.prisma.threatEvent.count({
        where: { userId, riskLevel: { in: ["HIGH", "CRITICAL"] }, createdAt: { gte: startDate } },
    });
    const suspiciousInteractions = await prisma_js_1.prisma.threatEvent.count({
        where: { userId, eventType: "SUSPICIOUS_INTERACTION", createdAt: { gte: startDate } },
    });
    return {
        totalThreatsBlocked,
        phishingDetections,
        maliciousActivity,
        suspiciousInteractions,
    };
};
exports.getDashboardSummary = getDashboardSummary;
const getDashboardTrend = async (userId, days = 7) => {
    const { startDate } = (0, date_1.getDateRangeFromDays)(days);
    const events = await prisma_js_1.prisma.threatEvent.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { createdAt: true, eventType: true, riskLevel: true },
    });
    const trendMap = {};
    // Initialize empty days
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendMap[(0, date_1.formatDateKey)(d)] = { phishing: 0, malicious: 0, suspicious: 0 };
    }
    events.forEach((event) => {
        const dateKey = (0, date_1.formatDateKey)(event.createdAt);
        if (!trendMap[dateKey])
            return;
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
exports.getDashboardTrend = getDashboardTrend;
const getDashboardSeverity = async (userId, days = 7) => {
    const { startDate } = (0, date_1.getDateRangeFromDays)(days);
    const severityGroup = await prisma_js_1.prisma.threatEvent.groupBy({
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
    severityGroup.forEach((group) => {
        const item = result.find((r) => r.name === group.riskLevel);
        if (item)
            item.value = group._count;
    });
    return result;
};
exports.getDashboardSeverity = getDashboardSeverity;
const getDashboardRecentEvents = async (userId, limit = 10) => {
    const events = await prisma_js_1.prisma.threatEvent.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { category: true, source: true },
    });
    return events.map((event) => ({
        ...event,
        category: event.category?.name || null,
        source: event.source?.domain || null,
    }));
};
exports.getDashboardRecentEvents = getDashboardRecentEvents;
const getDashboardRiskLevel = async (userId, days = 7) => {
    const { startDate } = (0, date_1.getDateRangeFromDays)(days);
    const avgResult = await prisma_js_1.prisma.threatEvent.aggregate({
        where: { userId, createdAt: { gte: startDate } },
        _avg: { riskScore: true },
    });
    const averageRiskScore = avgResult._avg.riskScore || 0;
    let riskLevel = "SAFE";
    if (averageRiskScore > 80)
        riskLevel = "CRITICAL";
    else if (averageRiskScore > 60)
        riskLevel = "HIGH";
    else if (averageRiskScore > 40)
        riskLevel = "MEDIUM";
    else if (averageRiskScore > 20)
        riskLevel = "LOW";
    return { averageRiskScore, riskLevel };
};
exports.getDashboardRiskLevel = getDashboardRiskLevel;
