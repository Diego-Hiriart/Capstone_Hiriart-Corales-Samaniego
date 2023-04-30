import { PrismaClient, TrainingGroup } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findTrainingGroupById(id: number) {
  try {
    const trainingGroup = await prisma.trainingGroup.findUnique({
      where: {
        trainingGroupID: id,
      },
    });
    return trainingGroup;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllTrainingGroup() {
  try {
    const trainingGroups = await prisma.trainingGroup.findMany();
    return trainingGroups;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createTrainingGroup(data: TrainingGroup) {
  try {
    const trainingGroup = await prisma.trainingGroup.create({
      data: {
        name: data.name,
        weapon: data.weapon,
      },
    });
    return trainingGroup;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateTrainingGroupById(id: number, data: TrainingGroup) {
  try {
    const trainingGroup = await prisma.trainingGroup.update({
      where: {
        trainingGroupID: id,
      },
      data: {
        name: data.name || undefined,
        weapon: data.weapon || undefined,
      },
    });
    return trainingGroup;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteTrainingGroupById(id: number) {
  try {
    const trainingGroup = await prisma.trainingGroup.delete({
      where: {
        trainingGroupID: id,
      },
    });
    return trainingGroup;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
