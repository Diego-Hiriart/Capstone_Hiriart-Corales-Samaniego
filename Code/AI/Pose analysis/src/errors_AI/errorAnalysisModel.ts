import * as tf from '@tensorflow/tfjs';
import { existsSync, readFileSync } from 'fs';

import { errorLog, debugLog } from '../utils/logs';

export function checkModelDataExists() {
  const modelPath = '../errors_AI_model_data/model.json';
  const weightsPath = '../errors_AI_model_data/weights.json';
  if (existsSync(modelPath) && existsSync(weightsPath)) {
    debugLog('Found previous model, loading');
    return true;
  } else {
    debugLog('No previous AI models found for transfer learning');
    return false;
  }
}

export async function loadModel() {
  let errorsModel;
  const modelJSON = JSON.parse(
    readFileSync('../errors_AI_model_data/model.json').toString()
  );
  errorsModel = await tf.models.modelFromJSON(modelJSON);
  const weightsArray = JSON.parse(
    readFileSync('../errors_AI_model_data/weights.json').toString()
  );
  let weightsTensor: tf.Tensor<tf.Rank>[] = [];
  weightsArray.forEach((weight: Array<number>) => {
    weightsTensor.push(tf.tensor(weight));
  });
  errorsModel.setWeights(weightsTensor);
  return errorsModel;
}

/* Runs prediction
 */
export async function runModel(
  errorsModel: tf.LayersModel,
  poseData: Array<any>
) {
  //Run
  let processedData: Array<any> = [];
  poseData.forEach((pose: Array<any>) => {
    processedData.push([]);
    pose.forEach((keypoint: any) => {
      let keypointXYZ = [keypoint['x'], keypoint['y'], keypoint['z']];
      processedData[processedData.length - 1].push(keypointXYZ);
    });
  });
  let tensorX = tf.tensor([processedData]);
  let results = errorsModel.predict(tensorX).toString();
  return JSON.parse(results.slice(13, results.length - 2));
}
