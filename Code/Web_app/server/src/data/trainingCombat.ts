import { PrismaClient, TrainingCombat } from "@prisma/client";

const prisma = new PrismaClient();

export async function findTrainingCombatById(id: number) {
  try {
    const trainingCombat = await prisma.trainingCombat.findUnique({
      where: {
        trainingCombatID: id,
      },
    });
    return trainingCombat;
  } catch (error) {
    throw error;
  }
}

export async function findAllTrainingCombat() {
  try {
    const trainingCombat = await prisma.trainingCombat.findMany();
    return trainingCombat;
  } catch (error) {
    throw error;
  }
}

export async function createTrainingCombat(data: TrainingCombat) {
  try {
    const trainingCombat = await prisma.trainingCombat.create({
      data: {
        fencer1ID: data.fencer1ID,
        fencer2ID: data.fencer2ID,
        fencer1Score: data.fencer1Score,
        fencer2Score: data.fencer2Score,
        dateTime: data.dateTime,
        winnerFencerID: data.winnerFencerID,
      },
    });
    return trainingCombat;
  } catch (error) {
    throw error;
  }
}

export async function updateTrainingCombatById(
  id: number,
  data: TrainingCombat
) {
  try {
    const trainingCombat = await prisma.trainingCombat.update({
      where: {
        trainingCombatID: id,
      },
      data: {
        fencer1ID: data.fencer1ID || undefined,
        fencer2ID: data.fencer2ID || undefined,
        fencer1Score: data.fencer1Score || undefined,
        fencer2Score: data.fencer2Score || undefined,
        dateTime: data.dateTime || undefined,
        winnerFencerID: data.winnerFencerID || undefined,
      },
    });
    return trainingCombat;
  } catch (error) {
    throw error;
  }
}

export async function deleteTrainingCombatById(id: number) {
  try {
    const trainingCombat = await prisma.trainingCombat.delete({
      where: {
        trainingCombatID: id,
      },
    });
    return trainingCombat;
  } catch (error) {
    throw error;
  }
}
