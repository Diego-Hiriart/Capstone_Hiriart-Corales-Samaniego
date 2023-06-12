/* eslint-disable no-loops/no-loops */
import { PrismaClient, MesoCycle } from "@prisma/client";

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

    console.log(dailyPlansDate);

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

interface DateRange {
  begin: Date;
  end: Date;
}

const getDaysArray = (start: Date, end: Date, id: number) => {
  const arr = [];
  const startDate: Date = new Date(start);
  const endDate: Date = new Date(end);

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push({ id: id, date: new Date(dt) });
  }

  return arr;
};

const getMicroCyclesDates = (startDate: Date, endDate: Date): DateRange[] => {
  const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const adjustToMonday = (date: Date): Date => {
    const adjustedDate = new Date(date);
    if (adjustedDate.getDay() > 1) {
      adjustedDate.setDate(adjustedDate.getDate() - adjustedDate.getDay());
    }
    return adjustedDate;
  };

  const generateDateRange = (start: Date, end: Date): DateRange[] => {
    const dates: DateRange[] = [];
    let newStart = start;
    let monday = adjustToMonday(start);

    while (newStart <= end) {
      const endWeekDate = addDays(monday, 7);

      if (endWeekDate > end) {
        dates.push({ begin: newStart, end });
      } else {
        dates.push({ begin: newStart, end: endWeekDate });
      }

      newStart = addDays(monday, 8);
      monday = addDays(monday, 7);
    }

    return dates;
  };

  return generateDateRange(startDate, endDate);
};

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
