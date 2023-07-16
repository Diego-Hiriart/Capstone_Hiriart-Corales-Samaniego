import { Request, Response } from "express";

import {
  createMesoCycle,
  deleteMesoCycleById,
  findAllMesoCycle,
  findGroupMesoCyclesByFencerIdForFeedbacks,
  findGroupMesoCyclesByFencerIdForGoals,
  findMesoCycleById,
  updateMesoCycleById,
} from "../data/mesoCycle";
import { errorLog } from "../utils/logs";

export async function getMesoCycleById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findMesoCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllMesoCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllMesoCycle(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postMesoCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createMesoCycle(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateMesoCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateMesoCycleById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMesoCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMesoCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getGroupMesoCyclesByFencerIdForGoals(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findGroupMesoCyclesByFencerIdForGoals(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getGroupMesoCyclesByFencerIdForFeedbacks(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findGroupMesoCyclesByFencerIdForFeedbacks(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
