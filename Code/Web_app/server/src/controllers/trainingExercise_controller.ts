import { Request, Response } from "express";
import { errorLog } from "../utils/logs";
import {
  createTrainingExercise,
  deleteTrainingExerciseById,
  findAllTrainingExercises,
} from "../data/trainingExercise";

export async function getAllTrainingExercises(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllTrainingExercises(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postTrainingExercise(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createTrainingExercise(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteTrainingExercise(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteTrainingExerciseById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
