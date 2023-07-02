/* eslint-disable no-loops/no-loops */
/* eslint-disable */

import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { existsSync, readFileSync, writeFile } from "fs";
import { findErrorBySystemName } from "../data/error";
import { createTrainingError } from "../data/trainingError";

import { debugLog } from "../utils/logs";

export function checkModelDataExists() {
  const modelPath = "./model.json";
  const weightsPath = "./weights.json";
  if (existsSync(modelPath) && existsSync(weightsPath)) {
    debugLog("Found model, loading");
    return true;
  } else {
    debugLog("No AI model found");
    return false;
  }
}

export async function loadModel() {
  let errorsModel;
  const modelJSON = JSON.parse(readFileSync("./model.json").toString());
  errorsModel = await tf.models.modelFromJSON(modelJSON);
  const weightsArray = JSON.parse(readFileSync("./weights.json").toString());
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
      return pose[0]["keypoints3D"];
    });
  });
  const xyzMovements = keypoints3DMovements.map((movement) => {
    return movement.map((pose) => {
      return pose!.map((keypoint) => {
        return [keypoint["x"], keypoint["y"], keypoint["z"]!];
      });
    });
  });
  //Run inference on all packets
  let aiResultIndex; //To get the correct movement data from DB, index of result
  let aiResultConfidence; //Percentage of confidence that movement belongs to a class
  let movementIndex; //To get the keypints data that will be returned to get graphed in the frontend
  let correctMove; //To return correct pose from DB
  let incorrectMove; //To return erro that was made
  let movementLabels = JSON.parse(
    readFileSync("./movementDictionary.json").toString()
  );
  for (let i = 0; i < xyzMovements.length; i++) {
    if (xyzMovements[i]) {
      let tensorX = tf.tensor([xyzMovements[i]]);
      let results = errorsModel.predict(tensorX) as tf.Tensor;
      //Get which class the movement belongs to
      let resultsArray = Array.from(results.dataSync());
      aiResultIndex = Array.from(tf.argMax(resultsArray).dataSync())[0]; //Get index of largest result
      aiResultConfidence = resultsArray[aiResultIndex]; //Get max result
      movementIndex = i;
      const condifenceThreshold = 0.8;
      //Continue analysis if detection is below threshold, otherwise check if it is an error or correct movement
      if (aiResultConfidence >= condifenceThreshold) {
        //Get name of class
        let classLabel: string = movementLabels[aiResultIndex];
        //Check if class detected belongs to movement being trained
        let classMatchesMovementSelected = false;
        switch (movementData.exercise) {
          case 1:
            if (classLabel.includes("Step forward")) {
              classMatchesMovementSelected = true;
            }
            break;
          case 2:
            if (classLabel.includes("Step back")) {
              classMatchesMovementSelected = true;
            }
            break;
          case 3:
            if (classLabel.includes("Point in line")) {
              classMatchesMovementSelected = true;
            }
            break;
          case 4:
            if (classLabel.includes("Lunge")) {
              classMatchesMovementSelected = true;
            }
            break;
        }
        //Check detected laterality matches
        let classMatchesLaterality = false;
        if (
          (classLabel.includes("left") && movementData.laterality === "I") ||
          (classLabel.includes("right") && movementData.laterality === "D")
        ) {
          classMatchesLaterality = true;
        }
        //Continue only if class matches selected movement or if it is a posible Guard error, and matches laterality
        if (
          (classMatchesMovementSelected || classLabel.includes("Guard")) &&
          classMatchesLaterality
        ) {
          //Stop analysis iteration if the detected movement is correct but not a correct Guard (since it could be a correct starting pose)
          if (classLabel.includes("correct") && !classLabel.includes("Guard")) {
            break;
          }
          /*Return error made if movement matches:
           * - Matches selected exercise (already checked before)
           * - Above 80% condifence (checked earlier)
           * - Laterality matches fencer (checked earlier)
           * - Is not a correct Guard (not an error)
           */
          if (!classLabel.includes("Guard correct")) {
            //Get error from DB that matches detected class
            let storedError = await findErrorBySystemName(classLabel);
            //Return correct movement and error made
            correctMove = storedError?.correctPose;
            //Get the error that was made from the passed data
            incorrectMove = movementPackets[movementIndex].map((pose) => {
              return [{ keypoints: pose[0]["keypoints"] }];
            });
            //Store error
            let trainingError = {
              AITrainingID: movementData.sessionId,
              errorID: storedError?.errorID!,
              poseData: JSON.stringify(incorrectMove),
            };
            await createTrainingError(trainingError);
            //Return error
            return {
              data: {
                correctMove,
                incorrectMove,
                title: storedError?.name,
                description: storedError?.description,
              },
            };
          }
        }
      }
    }
  }
  //Return empty response if nothing was found or correct movement was made
  return;
}
