import { PrismaClient, ActivityType } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findActivityTypeById(id: number) {
  try {
    const activityType = await prisma.activityType.findUnique({
      where: {
        activityTypeID: id,
      },
    });
    return activityType;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllActivityType() {
  try {
    const activityType = await prisma.activity.findMany();
    return activityType;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createActivityType(data: ActivityType) {
  try {
    const activityType = await prisma.activityType.create({
      data: {
        name: data.name,
      },
    });
    return activityType;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateActivityTypeById(id: number, data: ActivityType) {
  try {
    const activityType = await prisma.activityType.update({
      where: {
        activityTypeID: id,
      },
      data: {
        name: data.name,
      },
    });
    return activityType;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteActivityTypeById(id: number) {
  try {
    const activityType = await prisma.activityType.delete({
      where: {
        activityTypeID: id,
      },
    });
    return activityType;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
