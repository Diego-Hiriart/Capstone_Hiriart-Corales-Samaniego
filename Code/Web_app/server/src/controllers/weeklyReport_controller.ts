import { Request, Response } from "express";

import {
  createWeeklyReport,
  deleteWeeklyReportById,
  findAllWeeklyReport,
  findWeeklyReportById,
  updateWeeklyReportById,
} from "../data/weeklyReport";
import { errorLog } from "../utils/logs";

export async function getWeeklyReportById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findWeeklyReportById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllWeeklyReport(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllWeeklyReport(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postWeeklyReport(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createWeeklyReport(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateWeeklyReport(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateWeeklyReportById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteWeeklyReport(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteWeeklyReportById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
