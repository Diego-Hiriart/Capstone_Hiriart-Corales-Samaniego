import { Request, Response } from 'express';
import { LayersModel } from '@tensorflow/tfjs';

import { debugLog, errorLog } from '../utils/logs';
import {
  checkModelDataExists,
  loadModel,
  runModel,
} from '../errors_AI/errorAnalysisModel';

let errorsModel: LayersModel;

/* To POST poses to be analyzed
 * needs a list of x poses, e.g. 10 lists, each of 33 keypoints with x, y, and z
 */
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
