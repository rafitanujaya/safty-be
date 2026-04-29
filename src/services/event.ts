import { prisma } from "../db/prisma.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination";
import { Prisma } from "@prisma/client";

export const getEvents = async (userId: string, query: any) => {
  const { page, limit, skip } = getPagination(query);
  const { eventType, riskLevel, actionTaken, search } = query;

  const where: Prisma.ThreatEventWhereInput = { userId };

  if (eventType) where.eventType = eventType as any;
  if (riskLevel) where.riskLevel = riskLevel as any;
  if (actionTaken) where.actionTaken = actionTaken as any;

  if (search) {
    where.OR = [
      { domain: { contains: search as string, mode: "insensitive" } },
      { message: { contains: search as string, mode: "insensitive" } },
      { pageUrl: { contains: search as string, mode: "insensitive" } },
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
  }));

  return {
    items: mappedEvents,
    meta: buildPaginationMeta(total, page, limit),
  };
};
