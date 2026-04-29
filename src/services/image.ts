import { prisma } from "../db/prisma.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination";
import { calculateImageRisk } from "../utils/risk";
import { Prisma } from "@prisma/client";

export const getImages = async (userId: string, query: any) => {
  const { page, limit, skip } = getPagination(query);
  const { verdict, riskLevel } = query;

  const where: Prisma.ImageScanWhereInput = { userId };

  if (verdict) where.verdict = verdict as any;
  if (riskLevel) where.riskLevel = riskLevel as any;

  const [total, images] = await Promise.all([
    prisma.imageScan.count({ where }),
    prisma.imageScan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    items: images,
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getImageById = async (userId: string, imageId: string) => {
  const image = await prisma.imageScan.findUnique({
    where: { id: imageId },
  });

  if (!image || image.userId !== userId) {
    const error = new Error("Image scan not found");
    (error as any).status = 404;
    throw error;
  }

  return image;
};

export const scanImage = async (userId: string, file: Express.Multer.File) => {
  const { originalname, size, mimetype } = file;
  
  const riskResult = calculateImageRisk(originalname);

  let detectedIssues = [];
  if (riskResult.verdict === "SCAM" || riskResult.verdict === "SUSPICIOUS") {
    detectedIssues.push(riskResult.detectionNote);
  }

  const imageScan = await prisma.imageScan.create({
    data: {
      userId,
      imageName: originalname,
      imageType: mimetype,
      fileSize: size,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      verdict: riskResult.verdict,
      confidence: riskResult.confidence,
      detectionNote: riskResult.detectionNote,
    }
  });

  return {
    ...imageScan,
    detectedIssues
  };
};
