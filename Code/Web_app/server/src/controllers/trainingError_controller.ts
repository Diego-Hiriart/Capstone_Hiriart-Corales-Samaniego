import { Request, Response } from "express";

import {
  createTrainingError,
  deleteTrainingErrorById,
  findAllTrainingError,
  findTrainingErrorById,
  updateTrainingErrorById,
} from "../data/trainingError";
import { errorLog } from "../utils/logs";

export async function getTrainingErrorById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findTrainingErrorById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllTrainingError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllTrainingError(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postTrainingError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createTrainingError(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateTrainingError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateTrainingErrorById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteTrainingError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteTrainingErrorById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
