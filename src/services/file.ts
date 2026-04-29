import { prisma } from "../db/prisma.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination";
import { calculateFileRisk } from "../utils/risk";
import { Prisma } from "@prisma/client";

export const getFiles = async (userId: string, query: any) => {
  const { page, limit, skip } = getPagination(query);
  const { verdict, riskLevel, search } = query;

  const where: Prisma.FileScanWhereInput = { userId };

  if (verdict) where.verdict = verdict as any;
  if (riskLevel) where.riskLevel = riskLevel as any;
  if (search) where.fileName = { contains: search as string, mode: "insensitive" };

  const [total, files] = await Promise.all([
    prisma.fileScan.count({ where }),
    prisma.fileScan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    items: files,
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getFileById = async (userId: string, fileId: string) => {
  const file = await prisma.fileScan.findUnique({
    where: { id: fileId },
  });

  if (!file || file.userId !== userId) {
    const error = new Error("File scan not found");
    (error as any).status = 404;
    throw error;
  }

  return file;
};

export const scanFile = async (userId: string, file: Express.Multer.File) => {
  const { originalname, size, mimetype } = file;
  
  const riskResult = calculateFileRisk(originalname);

  const fileScan = await prisma.fileScan.create({
    data: {
      userId,
      fileName: originalname,
      fileType: mimetype,
      fileSize: size,
      ...riskResult
    }
  });

  return fileScan;
};
