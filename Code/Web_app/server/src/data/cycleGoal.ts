import { PrismaClient, CycleGoal } from "@prisma/client";

const prisma = new PrismaClient();

export async function findCycleGoalById(id: number) {
  try {
    const cycleGoal = await prisma.cycleGoal.findUnique({
      where: {
        cycleGoalID: id,
      },
    });
    return cycleGoal;
  } catch (error) {
    throw error;
  }
}

export async function findAllCycleGoal() {
  try {
    const cycleGoal = await prisma.cycleGoal.findMany();
    return cycleGoal;
  } catch (error) {
    throw error;
  }
}

export async function createCycleGoal(data: CycleGoal) {
  try {
    const cycleGoal = await prisma.cycleGoal.create({
      data: {
        fencerID: data.fencerID,
        trainerID: data.trainerID,
        mesoCycleID: data.mesoCycleID,
        date: data.date,
        content: data.content,
      },
    });
    return cycleGoal;
  } catch (error) {
    throw error;
  }
}

export async function updateCycleGoalById(id: number, data: CycleGoal) {
  try {
    const cycleGoal = await prisma.cycleGoal.update({
      where: {
        cycleGoalID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        mesoCycleID: data.mesoCycleID || undefined,
        date: data.date || undefined,
        content: data.content || undefined,
      },
    });
    return cycleGoal;
  } catch (error) {
    throw error;
  }
}

export async function deleteCycleGoalById(id: number) {
  try {
    const cycleGoal = await prisma.cycleGoal.delete({
      where: {
        cycleGoalID: id,
      },
    });
    return cycleGoal;
  } catch (error) {
    throw error;
  }
}

export async function findCycleGoalsByFencerId(id: number) {
  const cycleGoals = await prisma.cycleGoal.findMany({
    where: {
      fencerID: id,
    },
    include: {
      mesoCycle: true,
    }
  });
  return cycleGoals;
}