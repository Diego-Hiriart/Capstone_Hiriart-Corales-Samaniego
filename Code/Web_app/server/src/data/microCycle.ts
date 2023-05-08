import { PrismaClient, MicroCycle } from "@prisma/client";

const prisma = new PrismaClient();

export async function findMicroCycleById(id: number) {
  try {
    const microCycle = await prisma.microCycle.findUnique({
      where: {
        microCycleID: id,
      },
    });
    return microCycle;
  } catch (error) {
    throw error;
  }
}

export async function findAllMicroCycle() {
  try {
    const microCycles = await prisma.microCycle.findMany();
    return microCycles;
  } catch (error) {
    throw error;
  }
}

export async function createMicroCycle(data: MicroCycle) {
  try {
    const microCycle = await prisma.microCycle.create({
      data: {
        mesoCycleID: data.mesoCycleID,
        startDate: data.startDate,
        speed: data.speed,
        coordination: data.coordination,
        resistance: data.resistance,
        strength: data.strength,
        individualLessons: data.individualLessons,
        groupLessons: data.groupLessons,
        pairWork: data.pairWork,
        individualWork: data.individualLessons,
        technicalBasedCombats: data.technicalBasedCombats,
        trainingTournament: data.trainingTournament,
        freeCombat: data.freeCombat,
        tacticalIndividualLesson: data.tacticalIndividualLesson,
        competitionAnalysis: data.competitionAnalysis,
      },
    });
    return microCycle;
  } catch (error) {
    throw error;
  }
}

export async function updateMicroCycleById(id: number, data: MicroCycle) {
  try {
    const microCycle = await prisma.microCycle.update({
      where: {
        microCycleID: id,
      },
      data: {
        mesoCycleID: data.mesoCycleID || undefined,
        startDate: data.startDate || undefined,
        speed: data.speed || undefined,
        coordination: data.coordination || undefined,
        resistance: data.resistance || undefined,
        strength: data.strength || undefined,
        individualLessons: data.individualLessons || undefined,
        groupLessons: data.groupLessons || undefined,
        pairWork: data.pairWork || undefined,
        individualWork: data.individualLessons || undefined,
        technicalBasedCombats: data.technicalBasedCombats || undefined,
        trainingTournament: data.trainingTournament || undefined,
        freeCombat: data.freeCombat || undefined,
        tacticalIndividualLesson: data.tacticalIndividualLesson || undefined,
        competitionAnalysis: data.competitionAnalysis || undefined,
      },
    });
    return microCycle;
  } catch (error) {
    throw error;
  }
}

export async function deleteMicroCycleById(id: number) {
  try {
    const microCycle = await prisma.microCycle.delete({
      where: {
        microCycleID: id,
      },
    });
    return microCycle;
  } catch (error) {
    throw error;
  }
}
