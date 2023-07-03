import { Request, Response } from "express";

import {
  createTrainingGroup,
  deleteCycleById,
  deleteTrainingGroupById,
  findAllTrainingGroup,
  findTrainingGroupById,
  updateTrainingGroupById,
} from "../data/trainingGroup";
import { errorLog } from "../utils/logs";

export async function getTrainingGroupById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findTrainingGroupById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllTrainingGroup(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllTrainingGroup(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postTrainingGroup(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createTrainingGroup(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateTrainingGroup(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateTrainingGroupById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteTrainingGroup(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteTrainingGroupById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteTrainingGroupCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteCycleById(
        req.body.trainingGroupID,
        req.body.mesoCycleID
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
