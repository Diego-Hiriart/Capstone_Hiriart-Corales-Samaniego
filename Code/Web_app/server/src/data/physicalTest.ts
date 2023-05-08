import { PrismaClient, PhysicalTest } from "@prisma/client";

const prisma = new PrismaClient();

export async function findPhysicalTestById(id: number) {
  try {
    const physicalTest = await prisma.physicalTest.findUnique({
      where: {
        physicalTestID: id,
      },
    });
    return physicalTest;
  } catch (error) {
    throw error;
  }
}

export async function findAllPhysicalTest() {
  try {
    const physicalTest = await prisma.physicalTest.findMany();
    return physicalTest;
  } catch (error) {
    throw error;
  }
}

export async function createPhysicalTest(data: PhysicalTest) {
  try {
    const physicalTest = await prisma.physicalTest.create({
      data: {
        fencerID: data.fencerID,
        trainerID: data.trainerID,
        results: data.results,
        feedback: data.feedback,
      },
    });
    return physicalTest;
  } catch (error) {
    throw error;
  }
}

export async function updatePhysicalTestById(id: number, data: PhysicalTest) {
  try {
    const physicalTest = await prisma.physicalTest.update({
      where: {
        physicalTestID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        results: data.results || undefined,
        feedback: data.feedback || undefined,
      },
    });
    return physicalTest;
  } catch (error) {
    throw error;
  }
}

export async function deletePhysicalTestById(id: number) {
  try {
    const physicalTest = await prisma.physicalTest.delete({
      where: {
        physicalTestID: id,
      },
    });
    return physicalTest;
  } catch (error) {
    throw error;
  }
}
