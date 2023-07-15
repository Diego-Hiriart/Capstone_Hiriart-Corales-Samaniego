import { Request, Response } from 'express';
import { History } from '@tensorflow/tfjs';

import { errorLog } from '../utils/logs';
import { createAndTrainModel } from '../errors_AI/errorAnalysisModel';

/*To train model, with POST*/
export async function trainModel(req: Request, res: Response) {
  //To be used only for training
  const trainingResult = await createAndTrainModel(
    req.body.epochs,
    req.body.learningRate,
    req.body.batchSize
  );
  return res.status(200).json(trainingResult);
}
