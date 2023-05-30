import { Request, Response } from 'express';
import { LayersModel } from '@tensorflow/tfjs';

import { errorLog } from '../utils/logs';
import { createAndTrainModel } from '../errors_AI/errorAnalysisModel';

let errorsModel: LayersModel;

/*To train model, with POST*/
export async function trainModel(req: Request, res: Response) {
  //To be used only for training
  const trainingResult = await createAndTrainModel(
    req.body.epochs,
    req.body.learningRate,
    req.body.batchSize,
    req.body.posesPerMovement
  );
  return res.status(200).json(trainingResult);
}