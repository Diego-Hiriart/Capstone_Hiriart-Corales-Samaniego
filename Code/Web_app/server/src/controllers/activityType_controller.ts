import { Request, Response } from "express";

import {
  createActivityType,
  deleteActivityTypeById,
  findActivityTypeById,
  findAllActivityType,
  updateActivityTypeById,
} from "../data/activityType";
import { errorLog } from "../utils/logs";

export async function getActivityTypeById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findActivityTypeById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllActivityType(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllActivityType(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postActivityType(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createActivityType(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateActivityType(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateActivityTypeById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteActivityType(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteActivityTypeById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
