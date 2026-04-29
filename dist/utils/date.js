"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateKey = exports.getDateRangeFromDays = void 0;
const getDateRangeFromDays = (days) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
};
exports.getDateRangeFromDays = getDateRangeFromDays;
const formatDateKey = (date) => {
    return date.toISOString().split("T")[0];
};
exports.formatDateKey = formatDateKey;
