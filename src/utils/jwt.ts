import jwt, { type SignOptions } from "jsonwebtoken";
import env from "../config/env.js";

type TokenPayload = {
  userId: string;
  email: string;
};

const signToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export { signToken, verifyToken };
