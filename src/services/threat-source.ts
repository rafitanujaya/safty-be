import { prisma } from "../db/prisma.js";

export const getTopThreatSources = async (userId: string, limit = 5) => {
  const sourcesGroup = await prisma.threatEvent.groupBy({
    by: ["sourceId"],
    where: { userId, sourceId: { not: null } },
    _count: true,
    _max: { riskScore: true },
    orderBy: {
      _count: { sourceId: "desc" }
    },
    take: limit,
  });

  const sourceIds = sourcesGroup.map((g: any) => g.sourceId).filter((id: any) => id !== null) as string[];

  const sources = await prisma.threatSource.findMany({
    where: { id: { in: sourceIds } }
  });

  const result = sourcesGroup.map((group: any) => {
    const source = sources.find((s: any) => s.id === group.sourceId);
    return {
      id: source?.id,
      domain: source?.domain,
      totalIntercepts: group._count,
      riskScore: group._max.riskScore || 0,
      reputation: source?.reputation || 100
    };
  });

  return result;
};
