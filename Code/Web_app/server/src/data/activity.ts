import { PrismaClient, Activity } from "@prisma/client";

import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

export async function findActivityById(id: number) {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        activityID: id,
      },
    });
    return activity;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function findAllActivity() {
  try {
    const activity = await prisma.activity.findMany();
    return activity;
  } catch (error) {
    errorLog(error);
    throw [];
  }
}

export async function createActivity(data: Activity) {
  try {
    const activity = await prisma.activity.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        activityTypeID: data.activityTypeID,
      },
    });
    return activity;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function updateActivityById(id: number, data: Activity) {
  try {
    const activity = await prisma.activity.update({
      where: {
        activityID: id,
      },
      data: {
        name: data.name || undefined,
        description: data.description || undefined,
        duration: data.duration || undefined,
        activityTypeID: data.activityTypeID || undefined,
      },
    });
    return activity;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}

export async function deleteActivityById(id: number) {
  try {
    const activity = await prisma.activity.delete({
      where: {
        activityID: id,
      },
    });
    return activity;
  } catch (error) {
    errorLog(error);
    throw undefined;
  }
}
