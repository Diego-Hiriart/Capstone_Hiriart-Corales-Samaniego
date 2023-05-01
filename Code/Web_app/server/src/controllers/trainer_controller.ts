import { Request, Response } from "express";

import {
  createTrainer,
  findAllTrainer,
  findTrainerById,
  updateTrainerById,
} from "../data/trainer";
import { errorLog } from "../utils/logs";

export async function getTrainerById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findTrainerById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllTrainer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllTrainer(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postTrainer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createTrainer(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateTrainer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateTrainerById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
