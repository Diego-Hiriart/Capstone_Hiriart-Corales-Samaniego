import { Request, Response } from "express";

import {
  createAdmin,
  findAdminById,
  findAllAdmin,
  updateAdminById,
} from "../data/administrator";
import { errorLog } from "../utils/logs";

export async function getAdminById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAdminById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllAdmin(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllAdmin(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postAdmin(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createAdmin(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateAdmin(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateAdminById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
