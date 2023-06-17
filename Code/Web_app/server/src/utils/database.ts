import { PrismaClient } from "@prisma/client";
import crypto, { BinaryLike, CipherKey } from "crypto";

import { errorLog } from "./logs";

const prisma = new PrismaClient();

const secretKey = Buffer.from(process.env.SECRET_KEY || "", "hex");
const secretIv = Buffer.from(process.env.IV || "", "hex");

export async function healthCheck() {
  try {
    const userCount = await prisma.user.count();

    if (typeof userCount !== "number") {
      throw new Error("Couldn't connect to database");
    }

    return "Ok";
  } catch (error) {
    errorLog(error);
  }
}

export const encryptData = (
  plainText: string,
  key: CipherKey = secretKey,
  iv: BinaryLike = secretIv,
  algorithm = "aes-128-cbc"
) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decryptData = (
  encryptedData: string,
  key: CipherKey = secretKey,
  iv: BinaryLike = secretIv,
  algorithm = "aes-128-cbc"
) => {
  const decrypt = crypto.createDecipheriv(algorithm, key, iv);
  let text = decrypt.update(encryptedData, "base64", "utf8");
  text += decrypt.final("utf8");
  return text;
};
