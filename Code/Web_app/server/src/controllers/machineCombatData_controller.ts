import { Request, Response } from "express";

import {
  createMachineCombatData,
  deleteMachineByName,
  deleteMachineCombatDataByID,
  findAllMachineCombatData,
  findMachineCombatDataByName,
  updateMachineCombatDataByID,
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
      data: await updateMachineCombatDataByID(
        Number(req.params.id),
        req.body.data
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMachineCombatData(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMachineCombatDataByID(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteMachineCombatDataName(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteMachineByName(req.params.name),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
