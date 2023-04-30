import { PrismaClient, SingleFeedback } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findSingleFeedbackById(id: number) {
  try {
    const singleFeedback = await prisma.singleFeedback.findUnique({
      where: {
        singleFeedbackID: id,
      },
    });
    return singleFeedback;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllSingleFeedback() {
  try {
    const singleFeedbacks = await prisma.singleFeedback.findMany();
    return singleFeedbacks;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function updateUserById(id: number, data: SingleFeedback) {
  try {
    const singleFeedback = await prisma.singleFeedback.update({
      where: {
        singleFeedbackID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        date: data.date || undefined,
        content: data.content || undefined,
      },
    });
    return singleFeedback;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteSingleFeedbackById(id: number) {
  try {
    const singleFeedback = await prisma.singleFeedback.delete({
      where: {
        singleFeedbackID: id,
      },
    });
    return singleFeedback;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
