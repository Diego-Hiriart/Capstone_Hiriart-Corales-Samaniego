import { Request, Response } from "express";

import {
  createError,
  deleteErrorById,
  findAllError,
  findErrorById,
  updateErrorById,
} from "../data/error";
import { errorLog } from "../utils/logs";

export async function getErrorById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findErrorById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllError(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createError(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateErrorById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteError(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteErrorById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
