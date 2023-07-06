import { PrismaClient, Trainer, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function findTrainerById(id: number) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        trainerID: id,
      },
      include: {
        user: {
          select: {
            names: true,
            lastNames: true,
            email: true,
            roles: true,
          }
        }
      }
    });
    return trainer;
  } catch (error) {
    throw error;
  }
}

export async function findAllTrainer() {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        user: {
          select: {
            names: true,
            lastNames: true,
            email: true,
          }
        }
      }
    });
    return trainers;
  } catch (error) {
    throw error;
  }
}

export async function createTrainer(data: Trainer) {
  try {
    const trainer = await prisma.trainer.create({
      data: {
        userID: data.userID,
        experience: data.experience,
        weapon: data.weapon,
        pictureURL: data.pictureURL,
      },
    });
    return trainer;
  } catch (error) {
    throw error;
  }
}

export async function updateTrainerById(id: number, data: (Trainer & User)) {
  try {
    const trainer = await prisma.trainer.update({
      where: {
        trainerID: id,
      },
      data: {
        experience: data.experience || undefined,
        weapon: data.weapon || undefined,
        pictureURL: data.pictureURL || undefined,
        user: {
          update: {
            names: data.names || undefined,
            lastNames: data.lastNames || undefined,
            email: data.email || undefined,
            roles: {
              set: data.roles || undefined,
            }
          },
        }
      },
    });
    return trainer;
  } catch (error) {
    throw error;
  }
}
