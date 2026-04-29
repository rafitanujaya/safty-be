import {
  ActionTaken,
  Prisma,
  RiskLevel,
  ThreatEventType,
} from "@prisma/client";
import { prisma } from "../db/prisma";

type GetThreatEventsFilter = {
  riskLevel?: string;
  eventType?: string;
  limit?: number;
};

type CreateThreatEventInput = {
  eventType: ThreatEventType;
  title: string;
  description?: string;
  riskLevel?: RiskLevel;
  riskScore?: number;
  reason?: string;
  sourceUrl?: string;
  domain?: string;
  actionTaken?: ActionTaken;
};

const getThreatEvents = async (
  userId: string,
  filter: GetThreatEventsFilter,
) => {
  const where: Prisma.ThreatEventWhereInput = {
    userId,
  };

  if (filter.riskLevel) {
    where.riskLevel = filter.riskLevel as RiskLevel;
  }

  if (filter.eventType) {
    where.eventType = filter.eventType as ThreatEventType;
  }

  return prisma.threatEvent.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: filter.limit ?? 20,
  });
};

const createThreatEvent = async (
  userId: string,
  input: CreateThreatEventInput,
) => {
  return prisma.threatEvent.create({
    data: {
      userId,
      eventType: input.eventType,
      title: input.title,
      description: input.description,
      riskLevel: input.riskLevel ?? "LOW",
      riskScore: input.riskScore ?? 0,
      reason: input.reason,
      sourceUrl: input.sourceUrl,
      domain: input.domain,
      actionTaken: input.actionTaken ?? "SCANNED",
    },
  });
};

export { getThreatEvents, createThreatEvent };
