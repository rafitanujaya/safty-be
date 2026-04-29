"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, next) => {
    console.error("Error Middleware:", err);
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    return (0, response_1.sendError)(res, message, statusCode);
};
exports.errorHandler = errorHandler;
