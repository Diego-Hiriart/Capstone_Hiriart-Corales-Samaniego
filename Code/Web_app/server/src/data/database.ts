import { PrismaClient } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

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
