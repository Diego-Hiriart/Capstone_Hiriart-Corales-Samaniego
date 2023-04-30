import { Request, Response } from "express";

import {
  createActivity,
  deleteActivityById,
  findActivityById,
  findAllActivity,
  updateActivityById,
} from "../data/activity";
import { errorLog } from "../utils/logs";

export async function getActivityById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findActivityById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllActivity(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createActivity(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateActivityById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteActivity(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteActivityById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
