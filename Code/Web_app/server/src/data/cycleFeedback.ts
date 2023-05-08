import { PrismaClient, CycleFeedback } from "@prisma/client";

import { errorLog } from "../utils/logs";

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
    errorLog(error);
    throw undefined;
  }
}

export async function findAllCycleFeedback() {
  try {
    const cycleFeedback = await prisma.cycleFeedback.findMany();
    return cycleFeedback;
  } catch (error) {
    errorLog(error);
    throw [];
  }
}

export async function createCycleFeedback(data: CycleFeedback) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.create({
      data: {
        fencerID: data.fencerID,
        trainerID: data.trainerID,
        mesoCycleID: data.mesoCycleID,
        date: data.date,
        content: data.content,
      },
    });
    return cycleFeedback;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function updateCycleFeedbackById(id: number, data: CycleFeedback) {
  try {
    const cycleFeedback = await prisma.cycleFeedback.update({
      where: {
        cycleFeedbackID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        mesoCycleID: data.mesoCycleID || undefined,
        date: data.date || undefined,
        content: data.content || undefined,
      },
    });
    return cycleFeedback;
  } catch (error) {
    errorLog(error);
    throw undefined;
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
    errorLog(error);
    throw undefined;
  }
}
