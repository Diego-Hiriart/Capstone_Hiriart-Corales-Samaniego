import * as tf from '@tensorflow/tfjs';
import { existsSync } from 'fs';

import { errorLog, debugLog } from '../utils/logs';

interface poseKeypoint {
  name: string;
  score: number;
  x: number;
  y: number;
  z: number;
}

type poseKeypointsArray = poseKeypoint[];

export function checkModelDataExists() {
  const modelPath =
    'D:/UDLA/Capstone Project/Repo/Code/AI/Pose analysis/src/errors_AI/errors_AI_model_data.jso';
  if (existsSync(modelPath)) {
    return true;
  } else {
    errorLog('AI model files are missing, contact support');
    return false;
  }
}

export async function loadModel() {
  //Load model's topology and weights
  const errorsModel = await tf.loadLayersModel(
    'file://./errors_AI_model_data.json'
  );
  return errorsModel;
}

export async function runModel(
  errosModel: tf.LayersModel,
  poseData: poseKeypointsArray[]
) {
  //Run
}