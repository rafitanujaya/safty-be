import { prisma } from "../db/prisma.js";
import { Prisma } from "@prisma/client";

export const getEducationArticles = async (query: any) => {
  const { category, difficulty, relatedThreatType } = query;

  const where: Prisma.ScamEducationContentWhereInput = {};

  if (category) where.category = category as string;
  if (difficulty) where.difficulty = difficulty as any;
  if (relatedThreatType) where.relatedThreatType = relatedThreatType as any;

  const articles = await prisma.scamEducationContent.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return articles;
};
