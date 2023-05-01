import { Request, Response } from "express";

import {
  createDailyPlan,
  deleteDailyPlanById,
  findAllDailyPlan,
  findDailyPlanById,
  updateDailyPlanById,
} from "../data/dailyPlan";
import { errorLog } from "../utils/logs";

export async function getDailyPlanById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findDailyPlanById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllDailyPlan(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllDailyPlan(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postDailyPlan(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createDailyPlan(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateDailyPlan(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateDailyPlanById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteDailyPlan(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteDailyPlanById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
