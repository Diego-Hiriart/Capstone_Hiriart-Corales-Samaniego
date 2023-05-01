import { PrismaClient, MesoCycle } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findMesoCycleById(id: number) {
  try {
    const mesoCycle = await prisma.mesoCycle.findUnique({
      where: {
        mesoCycleID: id,
      },
    });
    return mesoCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllMesoCycle() {
  try {
    const mesoCycle = await prisma.mesoCycle.findMany();
    return mesoCycle;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createMesoCycle(data: MesoCycle) {
  try {
    const mesoCycle = await prisma.mesoCycle.create({
      data: {
        trainingGroupID: data.trainingGroupID,
        trainerID: data.trainerID,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        period: data.period,
        stage: data.stage,
        physicalScore: data.physicalScore,
        technicalScore: data.technicalScore,
        tacticalScore: data.tacticalScore,
      },
    });
    return mesoCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateMesoCycleById(id: number, data: MesoCycle) {
  try {
    const mesoCycle = await prisma.mesoCycle.update({
      where: {
        mesoCycleID: id,
      },
      data: {
        trainingGroupID: data.trainingGroupID || undefined,
        trainerID: data.trainerID || undefined,
        name: data.name || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        period: data.period || undefined,
        stage: data.stage || undefined,
        physicalScore: data.physicalScore || undefined,
        technicalScore: data.technicalScore || undefined,
        tacticalScore: data.tacticalScore || undefined,
      },
    });
    return mesoCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteMesoCycleById(id: number) {
  try {
    const mesoCycle = await prisma.mesoCycle.delete({
      where: {
        mesoCycleID: id,
      },
    });
    return mesoCycle;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
