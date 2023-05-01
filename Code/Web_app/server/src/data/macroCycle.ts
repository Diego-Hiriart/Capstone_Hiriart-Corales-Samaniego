import { PrismaClient, MacroCycle } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findMacroCycleById(id: number) {
  try {
    const macroCycle = await prisma.macroCycle.findUnique({
      where: {
        macroCycleID: id,
      },
    });
    return macroCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllMacroCycle() {
  try {
    const macroCycle = await prisma.macroCycle.findMany();
    return macroCycle;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createMacroCycle(data: MacroCycle) {
  try {
    const macroCycle = await prisma.macroCycle.create({
      data: {
        fencerID: data.fencerID,
        trainerID: data.trainerID,
        date: data.date,
        results: data.results,
        feedback: data.feedback,
      },
    });
    return macroCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateMacroCycleById(id: number, data: MacroCycle) {
  try {
    const macroCycle = await prisma.macroCycle.update({
      where: {
        macroCycleID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        date: data.date || undefined,
        results: data.results || undefined,
        feedback: data.feedback || undefined,
      },
    });
    return macroCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteMacroCycleById(id: number) {
  try {
    const macroCycle = await prisma.macroCycle.delete({
      where: {
        macroCycleID: id,
      },
    });
    return macroCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
