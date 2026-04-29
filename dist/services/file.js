"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFile = exports.getFileById = exports.getFiles = void 0;
const prisma_js_1 = require("../db/prisma.js");
const pagination_1 = require("../utils/pagination");
const risk_1 = require("../utils/risk");
const getFiles = async (userId, query) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(query);
    const { verdict, riskLevel, search } = query;
    const where = { userId };
    if (verdict)
        where.verdict = verdict;
    if (riskLevel)
        where.riskLevel = riskLevel;
    if (search)
        where.fileName = { contains: search, mode: "insensitive" };
    const [total, files] = await Promise.all([
        prisma_js_1.prisma.fileScan.count({ where }),
        prisma_js_1.prisma.fileScan.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
    ]);
    return {
        items: files,
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
};
exports.getFiles = getFiles;
const getFileById = async (userId, fileId) => {
    const file = await prisma_js_1.prisma.fileScan.findUnique({
        where: { id: fileId },
    });
    if (!file || file.userId !== userId) {
        const error = new Error("File scan not found");
        error.status = 404;
        throw error;
    }
    return file;
};
exports.getFileById = getFileById;
const scanFile = async (userId, file) => {
    const { originalname, size, mimetype } = file;
    const riskResult = (0, risk_1.calculateFileRisk)(originalname);
    const fileScan = await prisma_js_1.prisma.fileScan.create({
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
exports.scanFile = scanFile;
