import { Attendance, PrismaClient } from '@prisma/client';

import { errorLog } from '../utils/logs';

const prisma = new PrismaClient();

export async function findAttendanceById(id: number) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: {
        attendanceID: id,
      },
    });
    return attendance;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function findAllAttendance() {
  try {
    const attendance = await prisma.attendance.findMany();
    return attendance;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function createAttendance(data: Attendance) {
  try {
    const attendance = await prisma.attendance.create({
      data: {
        fencerID: data.fencerID,
        date: data.date,
        status: data.status,
      },
    });
    return attendance;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function updateAttendanceById(id: number, data: Attendance) {
  try {
    const attendance = await prisma.attendance.update({
      where: {
        attendanceID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        date: data.date || undefined,
        status: data.status || undefined,
      },
    });
    return attendance;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}

export async function deleteAttendanceById(id: number) {
  try {
    const attendance = await prisma.attendance.delete({
      where: {
        attendanceID: id,
      },
    });
    return attendance;
  } catch (error) {
    errorLog(error);
    return undefined;
  }
}
