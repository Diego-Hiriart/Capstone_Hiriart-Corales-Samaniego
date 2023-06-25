/* eslint-disable no-loops/no-loops */

import { PrismaClient, MesoCycle } from "@prisma/client";
import { getDaysArray, getMicroCyclesDates } from "../utils/dates";

const prisma = new PrismaClient();

export async function findMesoCycleById(id: number) {
  try {
    const mesoCycle = await prisma.mesoCycle.findUnique({
      where: {
        mesoCycleID: id,
      },
      include: {
        microCycle: {
          include: {
            dailyPlan: {
              include: {
                activityType: {
                  include: {
                    activity: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return mesoCycle;
  } catch (error) {
    throw error;
  }
}

export async function findAllMesoCycle() {
  try {
    const mesoCycle = await prisma.mesoCycle.findMany({
      include: {
        microCycle: true,
      },
    });
    return mesoCycle;
  } catch (error) {
    throw error;
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

    const dates = getMicroCyclesDates(mesoCycle.startDate, mesoCycle.endDate);

    const microCycles = [];

    for (let i = 0; i < dates.length; i++) {
      microCycles.push(
        await prisma.microCycle.create({
          data: {
            startDate: dates[i].begin,
            endDate: dates[i].end,
            mesoCycle: {
              connect: {
                mesoCycleID: mesoCycle.mesoCycleID,
              },
            },
          },
        })
      );
    }

    const dailyPlansDate = microCycles.map((cycle) =>
      getDaysArray(cycle.startDate, cycle.endDate, cycle.microCycleID)
    );

    dailyPlansDate.forEach((dates) =>
      dates.forEach(
        async (date) =>
          await prisma.dailyPlan.create({
            data: {
              date: date.date,
              microCycleID: date.id,
            },
          })
      )
    );
    return mesoCycle;
  } catch (error) {
    throw error;
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
    throw error;
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
    throw error;
  }
}
