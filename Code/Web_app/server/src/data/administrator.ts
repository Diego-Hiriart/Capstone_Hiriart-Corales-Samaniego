import { PrismaClient } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findAdminById(id: number) {
  try {
    const administrator = await prisma.administrator.findUnique({
      where: {
        administratorID: id,
      },
    });
    return administrator;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllAdmin() {
  try {
    const administrator = await prisma.administrator.findMany();
    return administrator;
  } catch (error) {
    errorLog(error);
    return [];
  }
}
