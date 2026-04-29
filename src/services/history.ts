import { prisma } from "../db/prisma.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination";
import { Prisma } from "@prisma/client";

export const getHistory = async (userId: string, query: any) => {
  // Same logic as event service, but different defaults in controller
  const { page, limit, skip } = getPagination(query);
  const { startDate, endDate, riskLevel, eventType, actionTaken, search } = query;

  const where: Prisma.ThreatEventWhereInput = { userId };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate as string);
    if (endDate) where.createdAt.lte = new Date(endDate as string);
  }

  if (eventType) where.eventType = eventType as any;
  if (riskLevel) where.riskLevel = riskLevel as any;
  if (actionTaken) where.actionTaken = actionTaken as any;

  if (search) {
    where.OR = [
      { domain: { contains: search as string, mode: "insensitive" } },
      { message: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const [total, events] = await Promise.all([
    prisma.threatEvent.count({ where }),
    prisma.threatEvent.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true, source: true },
    }),
  ]);

  const mappedEvents = events.map((event: any) => ({
    ...event,
    category: event.category?.name || null,
    source: event.source?.domain || null,
    timestamp: event.createdAt // Support frontend expectation
  }));

  return {
    items: mappedEvents,
    meta: buildPaginationMeta(total, page, limit),
  };
};
