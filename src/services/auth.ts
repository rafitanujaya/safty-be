import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";

export const registerUser = async (data: any) => {
  const { username, email, password } = data;

  if (!username || !email || !password) {
    const error = new Error("Missing required fields");
    (error as any).status = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    (error as any).status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
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
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error("Missing email or password");
    (error as any).status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    const error = new Error("Invalid credentials");
    (error as any).status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    (error as any).status = 401;
    throw error;
  }

  const secret = process.env.JWT_SECRET || "default_secret";
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    (error as any).status = 404;
    throw error;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
