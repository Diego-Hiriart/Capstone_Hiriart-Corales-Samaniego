import { Request, Response } from "express";

import {
  createMachineCombatData,
  deleteMachineCombatDataByName,
  findAllMachineCombatData,
  findMachineCombatDataByName,
  updateMachineCombatDataByName,
} from "../data/machineCombatData";
import { errorLog } from "../utils/logs";

export async function getMachineCombatDataByName(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findMachineCombatDataByName(req.params.name),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllMachineCombatData(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllMachineCombatData(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postMachineCombatData(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createMachineCombatData(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateMachineCombatData(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateMachineCombatDataByName(req.params.name, req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMachineCombatData(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMachineCombatDataByName(req.params.name),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
