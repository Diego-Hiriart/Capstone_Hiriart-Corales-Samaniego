import { User } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { removePasswordInUser } from "../data/user";

export const jwtSecret = process.env.JWT_SECRET || "a dumb secret";

export function generateToken(
  payload: User,
  privateKey: string,
  signOptions?: SignOptions
) {
  return jwt.sign(removePasswordInUser(payload), privateKey, signOptions);
}
