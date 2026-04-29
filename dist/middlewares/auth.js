"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return (0, response_1.sendError)(res, "Unauthorized", 401);
        }
        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "default_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Attach user to req
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        return (0, response_1.sendError)(res, "Invalid or expired token", 401);
    }
};
exports.authenticate = authenticate;
