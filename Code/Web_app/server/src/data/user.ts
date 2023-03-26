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
  } catch (error: any) {
    errorLog(error);
  }
}

export async function findUserById(id: number) {
  try {
    return await prisma.user.findUnique({
      where: {
        UserID: id,
      },
    });
  } catch (error) {
    return undefined;
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });
  } catch (error) {
    return undefined;
  }
}

export async function findAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    return [];
  }
}

export async function deleteUser(id: number) {
  try {
    return await prisma.user.update({
      where: {
        UserID: id,
      },
      data: {
        DeletedAt: new Date(),
      },
    });
  } catch (error) {
    return undefined;
  }
}
