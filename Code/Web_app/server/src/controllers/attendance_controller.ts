import { Request, Response } from "express";

import {
  createAttendance,
  deleteAttendanceById,
  findAllAttendance,
  findAttendanceById,
  updateAttendanceById,
} from "../data/attendance";
import { errorLog } from "../utils/logs";

export async function getAttendanceById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAttendanceById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllAttendance(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllAttendance(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postAttendance(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createAttendance(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateAttendance(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateAttendanceById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteAttendance(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteAttendanceById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
