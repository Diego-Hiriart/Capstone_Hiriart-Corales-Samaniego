import { Request, Response } from "express";

import {
  createPhysicalTest,
  deletePhysicalTestById,
  findAllPhysicalTest,
  findPhysicalTestById,
  updatePhysicalTestById,
} from "../data/physicalTest";
import { errorLog } from "../utils/logs";

export async function getPhysicalTestById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findPhysicalTestById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllPhysicalTest(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllPhysicalTest(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postPhysicalTest(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createPhysicalTest(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updatePhysicalTest(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updatePhysicalTestById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deletePhysicalTest(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deletePhysicalTestById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
