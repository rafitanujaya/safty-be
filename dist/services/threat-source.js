"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopThreatSources = void 0;
const prisma_js_1 = require("../db/prisma.js");
const getTopThreatSources = async (userId, limit = 5) => {
    const sourcesGroup = await prisma_js_1.prisma.threatEvent.groupBy({
        by: ["sourceId"],
        where: { userId, sourceId: { not: null } },
        _count: true,
        _max: { riskScore: true },
        orderBy: {
            _count: { sourceId: "desc" }
        },
        take: limit,
    });
    const sourceIds = sourcesGroup.map((g) => g.sourceId).filter((id) => id !== null);
    const sources = await prisma_js_1.prisma.threatSource.findMany({
        where: { id: { in: sourceIds } }
    });
    const result = sourcesGroup.map((group) => {
        const source = sources.find((s) => s.id === group.sourceId);
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
exports.getTopThreatSources = getTopThreatSources;
