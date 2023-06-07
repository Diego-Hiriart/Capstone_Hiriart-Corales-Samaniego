import { Request, Response } from "express";

import {
  createSingleFeedback,
  deleteSingleFeedbackById,
  findAllSingleFeedback,
  findFeedbacksByFencerId,
  findSingleFeedbackById,
  updateSingleFeedbackById,
} from "../data/singleFeedback";
import { errorLog } from "../utils/logs";
import { constants } from "../constants";

export async function getSingleFeedbackById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findSingleFeedbackById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllSingleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllSingleFeedback(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postSingleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createSingleFeedback(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateSingleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateSingleFeedbackById(
        Number(req.params.id),
        req.body.data
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteSingleFeedback(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteSingleFeedbackById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getSingleFeedbacksByFencerId(
  req: Request,
  res: Response
) {
  try {
    const take = req.query.take ?? constants.resultsPerPage;
    const page = req.query.page ?? 1;

    const data = await findFeedbacksByFencerId(
      Number(req.params.id),
      Number(take),
      Number(page)
    );
    return res.status(200).json(data);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
