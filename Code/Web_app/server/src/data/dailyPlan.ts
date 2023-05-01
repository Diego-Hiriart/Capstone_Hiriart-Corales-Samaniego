import { PrismaClient, DailyPlan } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findDailyPlanById(id: number) {
  try {
    const dailyPlan = await prisma.dailyPlan.findUnique({
      where: {
        dailyPlanID: id,
      },
    });
    return dailyPlan;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllDailyPlan() {
  try {
    const dailyPlans = await prisma.dailyPlan.findMany();
    return dailyPlans;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createDailyPlan(data: DailyPlan) {
  try {
    const dailyPlan = await prisma.dailyPlan.create({
      data: {
        microCycleID: data.microCycleID,
        date: data.date,
        activityTypeID: data.activityTypeID,
      },
    });
    return dailyPlan;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateDailyPlanById(id: number, data: DailyPlan) {
  try {
    const dailyPlan = await prisma.dailyPlan.update({
      where: {
        dailyPlanID: id,
      },
      data: {
        microCycleID: data.microCycleID || undefined,
        date: data.date || undefined,
        activityTypeID: data.activityTypeID || undefined,
      },
    });
    return dailyPlan;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteDailyPlanById(id: number) {
  try {
    const dailyPlan = await prisma.dailyPlan.delete({
      where: {
        dailyPlanID: id,
      },
    });
    return dailyPlan;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
