import { Request, Response } from "express";

import {
  createTrainingCombat,
  deleteTrainingCombatById,
  findAllTrainingCombat,
  findTrainingCombatById,
  updateTrainingCombatById,
} from "../data/trainingCombat";
import { errorLog } from "../utils/logs";

export async function getTrainingCombatById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findTrainingCombatById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllTrainingCombat(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllTrainingCombat(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postTrainingCombat(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createTrainingCombat(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateTrainingCombat(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateTrainingCombatById(
        Number(req.params.id),
        req.body.data
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteTrainingCombat(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteTrainingCombatById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
