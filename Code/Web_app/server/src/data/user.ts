import { PrismaClient, User } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export function removePasswordInUser(user: User) {
  const obj: Partial<Pick<User, "password">> & Omit<User, "password"> = user;
  delete obj["password"];
  return obj;
}

export async function findUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userID: id,
      },
    });
    return user ? removePasswordInUser(user) : user;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user ? removePasswordInUser(user) : user;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users.map((user) => removePasswordInUser(user));
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function softDeleteUserById(id: number) {
  try {
    const user = await prisma.user.update({
      where: {
        userID: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return user ? removePasswordInUser(user) : user;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateUserById(id: number, data: User) {
  try {
    const user = await prisma.user.update({
      where: {
        userID: id,
      },
      data: {
        email: data.email || undefined,
        password: data.password || undefined,
        names: data.names || undefined,
        lastNames: data.lastNames || undefined,
        roles: data.roles || undefined,
      },
    });
    return user ? removePasswordInUser(user) : user;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
