import { Request, Response } from "express";

import {
  createCycleGoal,
  deleteCycleGoalById,
  findAllCycleGoal,
  findCycleGoalByFencerIdAndCycleId,
  findCycleGoalById,
  findCycleGoalsByFencerId,
  updateCycleGoalById,
} from "../data/cycleGoal";
import { errorLog } from "../utils/logs";

export async function getCycleGoalById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findCycleGoalById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllCycleGoal(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllCycleGoal(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postCycleGoal(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createCycleGoal(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateCycleGoal(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateCycleGoalById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteCycleGoal(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteCycleGoalById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getCycleGoalsByFencerId(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findCycleGoalsByFencerId(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getCycleGoalByFencerIdAndCycleId(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findCycleGoalByFencerIdAndCycleId(Number(req.params.fencerId), Number(req.params.cycleId)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}