"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../db/prisma.js");
const registerUser = async (data) => {
    const { username, email, password } = data;
    if (!username || !email || !password) {
        const error = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }
    const existingUser = await prisma_js_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        const error = new Error("Email already exists");
        error.status = 409;
        throw error;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_js_1.prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            settings: {
                create: {} // Default protection settings based on schema defaults
            }
        },
    });
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        const error = new Error("Missing email or password");
        error.status = 400;
        throw error;
    }
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user || !user.password) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
const getUserById = async (userId) => {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.getUserById = getUserById;
