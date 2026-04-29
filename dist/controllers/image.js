"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanImage = exports.getImageById = exports.getImages = void 0;
const imageService = __importStar(require("../services/image"));
const response_1 = require("../utils/response");
const getImages = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await imageService.getImages(userId, req.query);
        return (0, response_1.sendSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
};
exports.getImages = getImages;
const getImageById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const imageId = req.params.id;
        const result = await imageService.getImageById(userId, imageId);
        return (0, response_1.sendSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
};
exports.getImageById = getImageById;
const scanImage = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        if (!req.file) {
            const error = new Error("No image uploaded");
            error.status = 400;
            throw error;
        }
        const result = await imageService.scanImage(userId, req.file);
        return (0, response_1.sendSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
};
exports.scanImage = scanImage;
