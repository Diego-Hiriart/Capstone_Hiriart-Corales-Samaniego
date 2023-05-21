import { RegistrationLink, User } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { removePasswordInUser } from "../data/user";

export const jwtSecret = process.env.JWT_SECRET || "a dumb secret";

export function generateToken(
  payload: User,
  secret: string,
  signOptions?: SignOptions
) {
  return jwt.sign(removePasswordInUser(payload), secret, signOptions);
}

export function generateRegistrationToken(
  payload: RegistrationLink,
  secret: string,
  signOptions?: SignOptions
) {
  return jwt.sign(payload, secret, signOptions);
}
