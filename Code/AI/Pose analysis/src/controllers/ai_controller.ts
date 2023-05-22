import { Request, Response } from 'express';
import { LayersModel } from '@tensorflow/tfjs';

import { errorLog } from '../utils/logs';
import {
  checkModelDataExists,
  loadModel,
  runModel,
  createAndTrainModel,
} from '../errors_AI/errorAnalysisModel';

let errorsModel: LayersModel;

/*To train model*/
export async function trainModel(req: Request, res: Response) {
  //To be used only for training
  createAndTrainModel();
  return res.status(200).json({ message: 'ok' });
}

/* To POST poses to be analyzed */
export async function poseAnalysis(req: Request, res: Response) {
  try {
    if (!errorsModel) {
      //Call to check if the NN's topology and weights exist to ensure it can be loaded later
      if (!checkModelDataExists()) {
        throw new Error('Model files do not exist');
      }
      //Load model and return it to be used in inference
      errorsModel = await loadModel();
    }
    let analysisResults = await runModel(errorsModel, req.body.poseData);
    return res.status(200).json({
      ai_result: analysisResults,
    });
  } catch (error) {
    errorLog(error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
