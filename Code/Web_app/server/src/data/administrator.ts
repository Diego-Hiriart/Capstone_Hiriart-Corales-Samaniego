import { Administrator, PrismaClient } from "@prisma/client";

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
    throw error;
  }
}

export async function findAllAdmin() {
  try {
    const administrator = await prisma.administrator.findMany();
    return administrator;
  } catch (error) {
    throw error;
  }
}

export async function createAdmin(data: Administrator) {
  try {
    const admin = await prisma.administrator.create({
      data: {
        userID: data.userID,
      },
    });
    return admin;
  } catch (error) {
    throw error;
  }
}

export async function updateAdminById(id: number, data: Administrator) {
  try {
    const admin = await prisma.administrator.update({
      where: {
        administratorID: id,
      },
      data: {
        userID: data.userID,
      },
    });
    return admin;
  } catch (error) {
    throw error;
  }
}
