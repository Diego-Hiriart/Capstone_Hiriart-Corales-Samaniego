import { Request, Response } from "express";

import {
  createMacroCycle,
  deleteMacroCycleById,
  findAllMacroCycle,
  findMacroCycleById,
  updateMacroCycleById,
} from "../data/macroCycle";
import { errorLog } from "../utils/logs";

export async function getMacroCycleById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findMacroCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllMacroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllMacroCycle(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postMacroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createMacroCycle(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateMacroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateMacroCycleById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMacroCycle(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMacroCycleById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
