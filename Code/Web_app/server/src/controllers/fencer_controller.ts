import { Request, Response } from "express";

import {
  createFencer,
  findAllFencer,
  findFencerById,
  updateFencerById,
} from "../data/fencer";
import { errorLog } from "../utils/logs";

export async function getFencerById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findFencerById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllFencer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllFencer(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postFencer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createFencer(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateFencer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateFencerById(Number(req.params.id), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
