/* eslint-disable no-loops/no-loops */
import * as tf from '@tensorflow/tfjs';
import { existsSync, readFileSync, writeFile } from 'fs';
import { Keypoint, Pose } from '@tensorflow-models/pose-detection';

import { debugLog } from '../utils/logs';

export function checkModelDataExists() {
  const modelPath = './model.json';
  const weightsPath = './weights.json';
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
  const modelJSON = JSON.parse(readFileSync('./model.json').toString());
  errorsModel = await tf.models.modelFromJSON(modelJSON);
  const weightsArray = JSON.parse(readFileSync('./weights.json').toString());
  let weightsTensor: tf.Tensor<tf.Rank>[] = [];
  weightsArray.forEach((weight: Array<number>) => {
    weightsTensor.push(tf.tensor(weight));
  });
  errorsModel.setWeights(weightsTensor);
  return errorsModel;
}

type DetectedPose = Pose[];

type Move = DetectedPose[];

interface MovementData {
  sessionID: number;
  exercise: number;
  laterality: string;
  move: Move;
}

/* Runs prediction
 */
export async function runModel(
  errorsModel: tf.LayersModel,
  movementData: MovementData
) {
  //Create an array of several 10 poses array
  const indexAddition = 10;
  const movementPackets = [];
  for (let i = 0; i < movementData.move.length; i++) {
    if (i + indexAddition - 1 >= movementData.move.length) {
      break;
    }
    movementPackets.push(movementData.move.slice(i, i + indexAddition));
  }
  //Extract only 3d keypoints from packets
  let keypoints3DMovements = movementPackets.map((packet) => {
    return packet.map((pose) => {
      return pose[0]['keypoints3D'];
    });
  });
  const xyzMovements = keypoints3DMovements.map((movement) => {
    return movement.map((pose) => {
      return pose!.map((keypoint) => {
        return [keypoint['x'], keypoint['y'], keypoint['z']!];
      });
    });
  });
  //Run inference on all packets
  let aiResults; //To get the correct movement data from DB
  let movementIndex; //To get the keypints data that will be returned to get graphed in the fronend
  for (let i = 0; i < xyzMovements.length; i++) {
    if (xyzMovements[i]) {
      let tensorX = tf.tensor([xyzMovements[i]]);
      let results = errorsModel.predict(tensorX) as tf.Tensor;
      let resultsArray = results.dataSync();
      if (resultsArray.some((result) => result >= 0.8)) {
        aiResults = resultsArray;
        movementIndex = i;
        break;
      }
    }
  }
  //Return empty if nothing was found
  if (movementIndex === undefined) {
    return;
  }
  //Return correct movement and error made
  //Get the error that was made from the passed data
  let incorrecMove = movementPackets[movementIndex].map((pose) => {
    return [{ keypoints: pose[0]['keypoints'] }];
  });
  return {
    data: { correctMove: [], incorrecMove },
  };
}
