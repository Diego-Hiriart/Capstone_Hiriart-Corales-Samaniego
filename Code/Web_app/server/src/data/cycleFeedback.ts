import { PrismaClient, CycleFeedback } from "@prisma/client";

const prisma = new PrismaClient();

export async function findCycleFeedbackById(id: number) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.findUnique({
      where: {
        cycleFeedbackID: id,
      },
    });
    return cycleFeedback;
  } catch (error) {
    throw error;
  }
}

export async function findAllCycleFeedback() {
  try {
    const cycleFeedback = await prisma.cycleFeedback.findMany();
    return cycleFeedback;
  } catch (error) {
    throw error;
  }
}

export async function createCycleFeedback(data: CycleFeedback) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.create({
      data: {
        trainerID: data.trainerID,
        mesoCycleID: data.mesoCycleID,
        date: data.date,
        content: data.content,
      },
    });
    return cycleFeedback;
  } catch (error) {
    throw error;
  }
}

export async function updateCycleFeedbackById(id: number, data: CycleFeedback) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.update({
      where: {
        cycleFeedbackID: id,
      },
      data: {
        trainerID: data.trainerID || undefined,
        mesoCycleID: data.mesoCycleID || undefined,
        date: data.date || undefined,
        content: data.content || undefined,
      },
    });
    return cycleFeedback;
  } catch (error) {
    throw error;
  }
}

export async function deleteCycleFeedbackById(id: number) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.delete({
      where: {
        cycleFeedbackID: id,
      },
    });
    return cycleFeedback;
  } catch (error) {
    throw error;
  }
}
