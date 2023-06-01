import { Request, Response } from 'express';
import { History } from '@tensorflow/tfjs';
const multer = require('multer');

import { errorLog } from '../utils/logs';
import { createAndTrainModel } from '../errors_AI/errorAnalysisModel';

/*To train model, with POST*/
export async function trainModel(req: Request, res: Response) {
  //To be used only for training
  const trainingResult = await createAndTrainModel(
    req.body.epochs,
    req.body.learningRate,
    req.body.batchSize,
    req.body.posesPerMovement
  );
  return res.status(500).json(trainingResult);
}

/*To save trained model, POST */
export async function saveModel(req: Request, res: Response) {
  try {
    const upload = multer({ dest: '../errors_AI_model_data' });
    console.log(req);
    return res.status(200);
  } catch (saveError) {
    return res.status(500).json(saveError);
  }
}
