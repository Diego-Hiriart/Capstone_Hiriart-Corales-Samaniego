import { PrismaClient, TrainingExercise } from "@prisma/client";

const prisma = new PrismaClient();

export async function findAllTrainingExercises() {
  try {
    const trainingExercises = await prisma.trainingExercise.findMany();
    return trainingExercises;
  } catch (error) {
    throw error;
  }
}

export async function createTrainingExercise(data: TrainingExercise) {
  try {
    const trainingExercise = await prisma.trainingExercise.create({
      data: {
        trainingExerciseID: data.trainingExerciseID,
        name: data.name,
        description: data.description,
      },
    });
    return trainingExercise;
  } catch (error) {
    throw error;
  }
}

export async function deleteTrainingExerciseById(id: number) {
  try {
    const trainingExercise = await prisma.trainingExercise.delete({
      where: {
        trainingExerciseID: id,
      },
    });
    return trainingExercise;
  } catch (error) {
    throw error;
  }
}
