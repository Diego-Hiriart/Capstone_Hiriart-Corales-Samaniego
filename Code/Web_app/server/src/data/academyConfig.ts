import { PrismaClient, AcademyConfig } from "@prisma/client";

const prisma = new PrismaClient();

export async function findConfigByID(id: number) {
  try {
    const config = await prisma.academyConfig.findUnique({
      where: {
        academyConfigID: id,
      },
    });
    return config;
  } catch (error) {
    throw error;
  }
}

export async function findAllConfig() {
  try {
    const config = await prisma.academyConfig.findMany();
    return config;
  } catch (error) {
    throw error;
  }
}

export async function createConfig(data: AcademyConfig) {
  try {
    const config = await prisma.academyConfig.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        logoURL: data.logoURL,
      },
    });
    return config;
  } catch (error) {
    throw error;
  }
}

export async function updateConfigById(id: number, data: AcademyConfig) {
  try {
    const config = await prisma.academyConfig.update({
      where: {
        academyConfigID: id,
      },
      data: {
        name: data.name || undefined,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        logoURL: data.logoURL || undefined,
      },
    });
    return config;
  } catch (error) {
    throw error;
  }
}

export async function deleteConfigById(id: number) {
  try {
    const activity = await prisma.academyConfig.delete({
      where: {
        academyConfigID: id,
      },
    });
    return activity;
  } catch (error) {
    throw error;
  }
}
