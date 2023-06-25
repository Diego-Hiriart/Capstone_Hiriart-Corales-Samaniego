import { PrismaClient, MachineCombatData } from "@prisma/client";

const prisma = new PrismaClient();

export async function findMachineCombatDataByName(name: string) {
  try {
    const machineCombatData = await prisma.machineCombatData.findMany({
      where: {
        machineName: name,
      },
      orderBy: {
        dateTime: "desc",
      },
    });
    return machineCombatData;
  } catch (error) {
    throw error;
  }
}

export async function findAllMachineCombatData() {
  try {
    const machineCombatData = await prisma.machineCombatData.findMany();
    return machineCombatData;
  } catch (error) {
    throw error;
  }
}

export async function createMachineCombatData(data: MachineCombatData) {
  try {
    const machineCombatData = await prisma.machineCombatData.create({
      data: {
        machineName: data.machineName,
        leftScore: data.leftScore,
        rightScore: data.rightScore,
        dateTime: data.dateTime,
        leftPriority: data.leftPriority,
        rightPriority: data.rightPriority,
      },
    });
    return machineCombatData;
  } catch (error) {
    throw error;
  }
}

export async function updateMachineCombatDataByID(
  id: number,
  data: MachineCombatData
) {
  try {
    const machineCombatData = await prisma.machineCombatData.update({
      where: {
        machineCombatDataID: id,
      },
      data: {
        machineName: data.machineName || undefined,
        leftScore: data.leftScore || undefined,
        rightScore: data.rightScore || undefined,
        dateTime: data.dateTime || undefined,
        leftPriority: data.leftPriority || undefined,
        rightPriority: data.rightPriority || undefined,
      },
    });
    return machineCombatData;
  } catch (error) {
    throw error;
  }
}

export async function deleteMachineCombatDataByID(id: number) {
  try {
    const machineCombatData = await prisma.machineCombatData.delete({
      where: {
        machineCombatDataID: id,
      },
    });
    return machineCombatData;
  } catch (error) {
    throw error;
  }
}
