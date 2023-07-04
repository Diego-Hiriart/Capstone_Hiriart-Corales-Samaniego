import { AITraining, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findAITrainingById(id: number) {
  try {
    const aITraining = await prisma.aITraining.findUnique({
      where: {
        AITrainingID: id,
      },
      include: {
        trainingError: {
          include: {
            error: true,
          },
        },
      },
    });
    return aITraining;
  } catch (error) {
    throw error;
  }
}

export async function findAllAITraining() {
  try {
    const aITraining = await prisma.aITraining.findMany();
    return aITraining;
  } catch (error) {
    throw error;
  }
}

export async function createAITraining(data: AITraining) {
  try {
    const aITraining = await prisma.aITraining.create({
      data: {
        fencerID: data.fencerID,
        date: data.date,
        duration: data.duration,
        feedback: data.feedback,
        trainerID: data.trainerID,
        trainingExerciseID: data.trainingExerciseID,
      },
    });
    return aITraining;
  } catch (error) {
    throw error;
  }
}

export async function updateAITrainingById(id: number, data: AITraining) {
  try {
    const aITraining = await prisma.aITraining.update({
      where: {
        AITrainingID: id,
      },
      data: {
        fencerID: data.fencerID,
        date: data.date,
        duration: data.duration,
        feedback: data.feedback,
        trainerID: data.trainerID,
      },
    });
    return aITraining;
  } catch (error) {
    throw error;
  }
}

export async function deleteAITrainingById(id: number) {
  try {
    const aITraining = await prisma.aITraining.delete({
      where: {
        AITrainingID: id,
      },
    });
    return aITraining;
  } catch (error) {
    throw error;
  }
}
