import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { signToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar_url: true,
      createdAt: true,
    },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return { user, token };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar_url: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
