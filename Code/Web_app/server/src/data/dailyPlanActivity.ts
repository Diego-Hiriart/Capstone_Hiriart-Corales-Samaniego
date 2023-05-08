import { PrismaClient, DailyPlanActivity } from "@prisma/client";

const prisma = new PrismaClient();

export async function findDailyPlanActivityById(id: number) {
  try {
    const dailyPlanActivity = await prisma.dailyPlanActivity.findUnique({
      where: {
        dailyPlanActivityID: id,
      },
    });
    return dailyPlanActivity;
  } catch (error) {
    throw error;
  }
}

export async function findAllDailyPlanActivity() {
  try {
    const dailyPlanActivity = await prisma.dailyPlanActivity.findMany();
    return dailyPlanActivity;
  } catch (error) {
    throw error;
  }
}

export async function createDailyPlanActivity(data: DailyPlanActivity) {
  try {
    const dailyPlanActivity = await prisma.dailyPlanActivity.create({
      data: {
        dailyPlanID: data.dailyPlanID,
        activityID: data.activityID,
      },
    });
    return dailyPlanActivity;
  } catch (error) {
    throw error;
  }
}

export async function updateDailyPlanActivityById(
  id: number,
  data: DailyPlanActivity
) {
  try {
    const dailyPlanActivity = await prisma.dailyPlanActivity.update({
      where: {
        dailyPlanActivityID: id,
      },
      data: {
        dailyPlanID: data.dailyPlanID || undefined,
        activityID: data.activityID || undefined,
      },
    });
    return dailyPlanActivity;
  } catch (error) {
    throw error;
  }
}

export async function deleteDailyPlanActivityById(id: number) {
  try {
    const dailyPlanActivity = await prisma.dailyPlanActivity.delete({
      where: {
        dailyPlanActivityID: id,
      },
    });
    return dailyPlanActivity;
  } catch (error) {
    throw error;
  }
}
