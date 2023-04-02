import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUserById(id: number) {
  try {
    return await prisma.user.findUnique({
      where: {
        userID: id,
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
        email: email,
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
        userID: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    return undefined;
  }
}
