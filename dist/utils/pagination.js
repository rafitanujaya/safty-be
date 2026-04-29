"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.getPagination = void 0;
const getPagination = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPagination = getPagination;
const buildPaginationMeta = (total, page, limit) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
