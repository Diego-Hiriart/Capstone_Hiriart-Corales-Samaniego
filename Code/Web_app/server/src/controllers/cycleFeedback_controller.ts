import { Request, Response } from "express";

import {
  createCycleFeedback,
  deleteCycleFeedbackById,
  findAllCycleFeedback,
  findCycleFeedbackById,
  updateCycleFeedbackById,
} from "../data/cycleFeedback";
import { errorLog } from "../utils/logs";

export async function getCycleFeedbackById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findCycleFeedbackById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllCycleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllCycleFeedback(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postCycleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createCycleFeedback(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateCycleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateCycleFeedbackById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteCycleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteCycleFeedbackById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
