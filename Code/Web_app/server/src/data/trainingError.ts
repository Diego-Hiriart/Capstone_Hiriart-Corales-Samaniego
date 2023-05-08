import { PrismaClient, TrainingError } from "@prisma/client";

const prisma = new PrismaClient();

export async function findTrainingErrorById(id: number) {
  try {
    const trainingError = await prisma.trainingError.findUnique({
      where: {
        trainingErrorID: id,
      },
    });
    return trainingError;
  } catch (error) {
    throw error;
  }
}

export async function findAllTrainingError() {
  try {
    const trainingError = await prisma.trainingError.findMany();
    return trainingError;
  } catch (error) {
    throw error;
  }
}

export async function createTrainingError(data: TrainingError) {
  try {
    const trainingError = await prisma.trainingError.create({
      data: {
        AITrainingID: data.AITrainingID,
        errorID: data.errorID,
        poseData: data.poseData,
      },
    });
    return trainingError;
  } catch (error) {
    throw error;
  }
}

export async function updateTrainingErrorById(id: number, data: TrainingError) {
  try {
    const trainingError = await prisma.trainingError.update({
      where: {
        trainingErrorID: id,
      },
      data: {
        AITrainingID: data.AITrainingID || undefined,
        errorID: data.errorID || undefined,
        poseData: data.poseData || undefined,
      },
    });
    return trainingError;
  } catch (error) {
    throw error;
  }
}

export async function deleteTrainingErrorById(id: number) {
  try {
    const trainingError = await prisma.trainingError.delete({
      where: {
        trainingErrorID: id,
      },
    });
    return trainingError;
  } catch (error) {
    throw error;
  }
}
