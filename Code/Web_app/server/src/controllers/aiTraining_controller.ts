import { Request, Response } from "express";

import {
  createAITraining,
  deleteAITrainingById,
  findAITrainingById,
  findAITrainingsByFencerId,
  findAllAITraining,
  updateAITrainingById,
} from "../data/aiTraining";
import { errorLog } from "../utils/logs";

export async function getAITrainingById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAITrainingById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllAITraining(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllAITraining(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postAITraining(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createAITraining(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateAITraining(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateAITrainingById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteAITraining(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteAITrainingById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAITrainingsByFencerId(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAITrainingsByFencerId(Number(req.params.id)),
    })
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}