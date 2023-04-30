import { PrismaClient, Trainer, User } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findTrainerById(id: number) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        trainerID: id,
      },
    });
    return trainer;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllTrainer() {
  try {
    const trainers = await prisma.trainer.findMany();
    return trainers;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function updateUserById(id: number, data: Trainer) {
  try {
    const trainer = await prisma.trainer.update({
      where: {
        trainerID: id,
      },
      data: {
        userID: data.userID || undefined,
        experience: data.experience || undefined,
        weapon: data.weapon || undefined,
        pictureURL: data.pictureURL || undefined,
        guestName: data.guestName || undefined,
      },
    });
    return trainer;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
