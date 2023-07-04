/* eslint-disable no-loops/no-loops */
/* eslint-disable */

import { Keypoint, Pose } from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { existsSync, readFileSync } from 'fs';
import { findErrorBySystemName } from '../data/error';
import { createTrainingError } from '../data/trainingError';

import { debugLog } from '../utils/logs';
import { SrvRecord } from 'dns';

export function checkModelDataExists() {
  const modelPath = './model.json';
  const weightsPath = './weights.json';
  if (existsSync(modelPath) && existsSync(weightsPath)) {
    debugLog('Found model, loading');
    return true;
  } else {
    debugLog('No AI model found');
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
  sessionId: number;
  exercise: number;
  laterality: string;
  move: Move;
}

/*Extract all 2d keypionts from data
 */
function extract2DKeypoints(movement: Move) {
  let keypoints2D: Move = [];
  movement.forEach((movement) => {
    movement.forEach((pose) => {
      keypoints2D.push([{ keypoints: pose.keypoints }]);
    });
  });
  return keypoints2D;
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
  let aiResultIndex; //To get the correct movement data from DB, index of result
  let aiResultConfidence; //Percentage of confidence that movement belongs to a class
  const condifenceThreshold = 0.7;
  let correctMove; //To return correct pose from DB
  let incorrectMove; //To return error that was made
  let movementLabels = JSON.parse(
    readFileSync('./movementDictionary.json').toString()
  );
  let trainingClass: string = movementLabels[movementData.exercise - 1]; //To store detected class, initliaze with class being trained
  for (let i = 0; i < xyzMovements.length; i++) {
    if (xyzMovements[i]) {
      let tensorX = tf.tensor([xyzMovements[i]]);
      let results = errorsModel.predict(tensorX) as tf.Tensor;
      let classLabel: string; //To check error made
      //Get which class the movement belongs to
      let resultsArray = Array.from(results.dataSync());
      aiResultIndex = Array.from(tf.argMax(resultsArray).dataSync())[0]; //Get index of largest result
      aiResultConfidence = resultsArray[aiResultIndex]; //Get max result
      //Continue analysis if detection is below threshold, otherwise check if it is an error or correct movement
      if (aiResultConfidence >= condifenceThreshold) {
        //Get name of class
        classLabel = movementLabels[aiResultIndex];
        //Check if class detected belongs to movement being trained
        let classMatchesMovementSelected = false;
        switch (movementData.exercise) {
          case 1:
            if (classLabel.includes('Step forward')) {
              classMatchesMovementSelected = true;
            }
            break;
          case 2:
            if (classLabel.includes('Step back')) {
              classMatchesMovementSelected = true;
            }
            break;
          case 3:
            if (classLabel.includes('Point in line')) {
              classMatchesMovementSelected = true;
            }
            break;
          case 4:
            if (classLabel.includes('Lunge')) {
              classMatchesMovementSelected = true;
            }
            break;
        }
        //Check detected laterality matches
        let classMatchesLaterality = false;
        if (
          (classLabel.includes('left') && movementData.laterality === 'I') ||
          (classLabel.includes('right') && movementData.laterality === 'D')
        ) {
          classMatchesLaterality = true;
        }
        //If movement or laterality dont match, it means the movement was pretty bad return as error
        if (!classMatchesMovementSelected || !classMatchesLaterality) {
          incorrectMove = extract2DKeypoints(movementData.move);
          let storedError = await findErrorBySystemName(trainingClass);
          //Store error
          let trainingError = {
            AITrainingID: movementData.sessionId,
            errorID: storedError?.errorID!,
            poseData: JSON.stringify(incorrectMove),
          };
          await createTrainingError(trainingError);
          return {
            data: {
              correctMove,
              incorrectMove,
              title: storedError?.name,
              description: storedError?.description,
            },
          };
        }
        //If movement and laterality match, return empty, since it means it was a good movement
        if (classMatchesMovementSelected && classMatchesLaterality) {
          return;
        }
      }
    }
  }
  /*If execution gets to this point, it means a good enough movement
   * was never detected, return as error
   */
  incorrectMove = extract2DKeypoints(movementData.move);
  let storedError = await findErrorBySystemName(trainingClass);
  //Store error
  let trainingError = {
    AITrainingID: movementData.sessionId,
    errorID: storedError?.errorID!,
    poseData: JSON.stringify(incorrectMove),
  };
  await createTrainingError(trainingError);
  return {
    data: {
      correctMove,
      incorrectMove,
      title: storedError?.name,
      description: storedError?.description,
    },
  };
}
