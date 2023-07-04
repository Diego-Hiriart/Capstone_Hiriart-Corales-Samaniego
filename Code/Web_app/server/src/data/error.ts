import { PrismaClient, Error } from '@prisma/client';

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
    throw error;
  }
}

export async function findAllError() {
  try {
    const error = await prisma.error.findMany();
    return error;
  } catch (error) {
    throw error;
  }
}

export async function findErrorBySystemName(systemName: string) {
  try {
    const error = await prisma.error.findUnique({
      where: {
        systemName: systemName,
      },
    });
    return error;
  } catch (error) {
    throw error;
  }
}

export async function createError(data: Error) {
  try {
    const error = await prisma.error.create({
      data: {
        name: data.name,
        description: data.description,
        correctPose: data.correctPose,
        systemName: data.systemName,
      },
    });
    return error;
  } catch (error) {
    throw error;
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
    throw error;
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
    throw error;
  }
}
