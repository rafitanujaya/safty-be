"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const prisma_js_1 = require("../db/prisma.js");
const pagination_1 = require("../utils/pagination");
const getEvents = async (userId, query) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(query);
    const { eventType, riskLevel, actionTaken, search } = query;
    const where = { userId };
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
            { pageUrl: { contains: search, mode: "insensitive" } },
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
    }));
    return {
        items: mappedEvents,
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
};
exports.getEvents = getEvents;
