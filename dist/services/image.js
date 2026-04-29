"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanImage = exports.getImageById = exports.getImages = void 0;
const prisma_js_1 = require("../db/prisma.js");
const pagination_1 = require("../utils/pagination");
const risk_1 = require("../utils/risk");
const getImages = async (userId, query) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(query);
    const { verdict, riskLevel } = query;
    const where = { userId };
    if (verdict)
        where.verdict = verdict;
    if (riskLevel)
        where.riskLevel = riskLevel;
    const [total, images] = await Promise.all([
        prisma_js_1.prisma.imageScan.count({ where }),
        prisma_js_1.prisma.imageScan.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
    ]);
    return {
        items: images,
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
};
exports.getImages = getImages;
const getImageById = async (userId, imageId) => {
    const image = await prisma_js_1.prisma.imageScan.findUnique({
        where: { id: imageId },
    });
    if (!image || image.userId !== userId) {
        const error = new Error("Image scan not found");
        error.status = 404;
        throw error;
    }
    return image;
};
exports.getImageById = getImageById;
const scanImage = async (userId, file) => {
    const { originalname, size, mimetype } = file;
    const riskResult = (0, risk_1.calculateImageRisk)(originalname);
    let detectedIssues = [];
    if (riskResult.verdict === "SCAM" || riskResult.verdict === "SUSPICIOUS") {
        detectedIssues.push(riskResult.detectionNote);
    }
    const imageScan = await prisma_js_1.prisma.imageScan.create({
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
exports.scanImage = scanImage;
