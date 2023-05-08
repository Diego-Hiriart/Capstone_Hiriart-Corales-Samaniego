import { PrismaClient, Error } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findErrorById(id: number) {
  try {
    const error = await prisma.error.findUnique({
      where: {
        errorID: id,
      },
    });
    return error;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function findAllError() {
  try {
    const error = await prisma.error.findMany();
    return error;
  } catch (error) {
    errorLog(error);
    throw [];
  }
}

export async function createError(data: Error) {
  try {
    const error = await prisma.error.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return error;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function updateErrorById(id: number, data: Error) {
  try {
    const error = await prisma.error.update({
      where: {
        errorID: id,
      },
      data: {
        name: data.name || undefined,
        description: data.description || undefined,
      },
    });
    return error;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function deleteErrorById(id: number) {
  try {
    const error = await prisma.error.delete({
      where: {
        errorID: id,
      },
    });
    return error;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}
