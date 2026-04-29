"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const prisma_js_1 = require("../db/prisma.js");
const pagination_1 = require("../utils/pagination");
const getHistory = async (userId, query) => {
    // Same logic as event service, but different defaults in controller
    const { page, limit, skip } = (0, pagination_1.getPagination)(query);
    const { startDate, endDate, riskLevel, eventType, actionTaken, search } = query;
    const where = { userId };
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate)
            where.createdAt.gte = new Date(startDate);
        if (endDate)
            where.createdAt.lte = new Date(endDate);
    }
    if (eventType)
        where.eventType = eventType;
    if (riskLevel)
        where.riskLevel = riskLevel;
    if (actionTaken)
        where.actionTaken = actionTaken;
    if (search) {
        where.OR = [
            { domain: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
        ];
    }
    const [total, events] = await Promise.all([
        prisma_js_1.prisma.threatEvent.count({ where }),
        prisma_js_1.prisma.threatEvent.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { category: true, source: true },
        }),
    ]);
    const mappedEvents = events.map((event) => ({
        ...event,
        category: event.category?.name || null,
        source: event.source?.domain || null,
        timestamp: event.createdAt // Support frontend expectation
    }));
    return {
        items: mappedEvents,
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
};
exports.getHistory = getHistory;
