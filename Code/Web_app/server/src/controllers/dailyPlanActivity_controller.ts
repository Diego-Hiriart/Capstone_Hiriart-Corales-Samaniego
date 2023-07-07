import { Request, Response } from "express";

import {
  createDailyPlanActivity,
  deleteDailyPlanActivityById,
  findAllDailyPlanActivity,
  findDailyPlanActivityById,
  removeActivityFromPlanByID,
  updateDailyPlanActivityById,
} from "../data/dailyPlanActivity";
import { errorLog } from "../utils/logs";

export async function getDailyPlanActivityById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findDailyPlanActivityById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllDailyPlanActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllDailyPlanActivity(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postDailyPlanActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createDailyPlanActivity(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateDailyPlanActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateDailyPlanActivityById(
        Number(req.params.id),
        req.body.data
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function removeActivityFromPlan(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await removeActivityFromPlanByID(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteDailyPlanActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteDailyPlanActivityById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
