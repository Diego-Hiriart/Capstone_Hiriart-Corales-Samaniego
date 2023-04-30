import { Request, Response } from "express";

import {
  createMicroCycle,
  deleteMicroCycleById,
  findAllMicroCycle,
  findMicroCycleById,
  updateMicroCycleById,
} from "../data/microCycle";
import { errorLog } from "../utils/logs";

export async function getMicroCycleById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findMicroCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllMicroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllMicroCycle(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postMicroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createMicroCycle(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateMicroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateMicroCycleById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMicroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMicroCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
