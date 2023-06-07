import { PrismaClient, ActivityType } from "@prisma/client";

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
    throw error;
  }
}

export async function findAllActivityType() {
  try {
    const activityType = await prisma.activityType.findMany();
    return activityType;
  } catch (error) {
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
}
