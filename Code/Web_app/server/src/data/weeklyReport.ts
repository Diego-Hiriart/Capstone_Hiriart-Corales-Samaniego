import { PrismaClient, WeeklyReport } from "@prisma/client";

const prisma = new PrismaClient();

export async function findWeeklyReportById(id: number) {
  try {
    const weeklyReport = await prisma.weeklyReport.findUnique({
      where: {
        weeklyReportID: id,
      },
    });
    return weeklyReport;
  } catch (error) {
    throw error;
  }
}

export async function findAllWeeklyReport() {
  try {
    const weeklyReport = await prisma.weeklyReport.findMany();
    return weeklyReport;
  } catch (error) {
    throw error;
  }
}

export async function createWeeklyReport(data: WeeklyReport) {
  try {
    const weeklyReport = await prisma.weeklyReport.create({
      data: {
        fencerID: data.fencerID,
        trainerID: data.trainerID,
        date: data.date,
        content: data.content,
      },
    });
    return weeklyReport;
  } catch (error) {
    throw error;
  }
}

export async function updateWeeklyReportById(id: number, data: WeeklyReport) {
  try {
    const weeklyReport = await prisma.weeklyReport.update({
      where: {
        weeklyReportID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        trainerID: data.trainerID || undefined,
        date: data.date || undefined,
        content: data.content || undefined,
      },
    });
    return weeklyReport;
  } catch (error) {
    throw error;
  }
}

export async function deleteWeeklyReportById(id: number) {
  try {
    const weeklyReport = await prisma.weeklyReport.delete({
      where: {
        weeklyReportID: id,
      },
    });
    return weeklyReport;
  } catch (error) {
    throw error;
  }
}
