import { Request, Response } from "express";

import {
  createConfig,
  deleteConfigById,
  findAllConfig,
  findConfigByID,
  updateConfigById,
} from "../data/academyConfig";
import { errorLog } from "../utils/logs";

export async function getConfigById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findConfigByID(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllConfig(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllConfig(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postConfig(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createConfig(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateConfig(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateConfigById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteConfig(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteConfigById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
