import jwt, { SignOptions } from "jsonwebtoken";

import { User } from "@prisma/client";

// User object to store in jwt
export type UserJWT = Omit<User, "password">;

export const jwtSecret = process.env.JWT_SECRET || "a dumb secret";

export function generateToken(
  payload: UserJWT,
  privateKey: string,
  signOptions?: SignOptions
) {
  return jwt.sign(payload, privateKey, signOptions);
}
