"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEducationArticles = void 0;
const prisma_js_1 = require("../db/prisma.js");
const getEducationArticles = async (query) => {
    const { category, difficulty, relatedThreatType } = query;
    const where = {};
    if (category)
        where.category = category;
    if (difficulty)
        where.difficulty = difficulty;
    if (relatedThreatType)
        where.relatedThreatType = relatedThreatType;
    const articles = await prisma_js_1.prisma.scamEducationContent.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
    return articles;
};
exports.getEducationArticles = getEducationArticles;
