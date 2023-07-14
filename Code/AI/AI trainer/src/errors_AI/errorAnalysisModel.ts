import * as tf from "@tensorflow/tfjs";
import { existsSync, readFileSync, writeFile } from "fs";

import { errorLog, debugLog } from "../utils/logs";

export function checkModelDataExists() {
  const modelPath = "../errors_AI_model_data/model.json";
  const weightsPath = "../errors_AI_model_data/weights.json";
  if (existsSync(modelPath) && existsSync(weightsPath)) {
    debugLog("Found previous model, loading");
    return true;
  } else {
    debugLog("No previous AI models found for transfer learning");
    return false;
  }
}

function onEpochEnd(epoch: any, logs: any) {
  debugLog(
    `Epoch ${epoch}\n \t-validation accuracy: ${logs.val_acc} | validation loss:${logs.val_loss} \n\t-accuracy: ${logs.acc} | loss:${logs.loss}`
  );
}

export async function createAndTrainModel(
  epochs: number,
  learningRate: number,
  batchSize: number
) {
  try {
    let errorsModel;
    const trainingEpochs = epochs;
    const outputNeurons = 10; //Detectable movements (includes correct movements)
    if (checkModelDataExists()) {
      const modelJSON = JSON.parse(
        readFileSync("../errors_AI_model_data/model.json").toString()
      );
      errorsModel = await tf.models.modelFromJSON(modelJSON);
      const weightsArray = JSON.parse(
        readFileSync("../errors_AI_model_data/weights.json").toString()
      );
      let weightsTensor: tf.Tensor<tf.Rank>[] = [];
      weightsArray.forEach((weight: Array<number>) => {
        weightsTensor.push(tf.tensor(weight));
      });
      errorsModel.setWeights(weightsTensor);
    } else {
      errorsModel = tf.sequential();
      errorsModel.name = "posesMLP";
      const inputKeypoints = 33;
      const keypointFeatures = 3;
      //If xs is a 3d tensor of shape [a, b, c,d], then inputShape of the first layer should be [b, c, d].
      //Shape of xs is [batch, 10 (poses per movement), 33 (keypoints), 3 (x, y, z of each keypoint)];
      const timesteps = 10;
      const inputLayerShape = [timesteps, inputKeypoints, keypointFeatures];
      const hidden1LayerFeatures = inputKeypoints * keypointFeatures;
      const hidden1InputShape = [timesteps, hidden1LayerFeatures];
      //Input layer
      errorsModel.add(
        tf.layers.dense({
          name: "input-layer",
          units: keypointFeatures,
          inputShape: inputLayerShape,
          activation: "sigmoid",
        })
      );
      //Hidden layers, fully connected with sigmoid activation
      errorsModel.add(
        tf.layers.reshape({
          name: "hidden1Reshape",
          targetShape: hidden1InputShape,
        })
      );
      errorsModel.add(
        tf.layers.dense({
          name: "hidden-1",
          activation: "sigmoid",
          units: 33,
        })
      );
      errorsModel.add(
        tf.layers.reshape({ name: "hidden2Reshape", targetShape: [330] })
      );
      errorsModel.add(
        tf.layers.dense({
          name: "hidden-2",
          activation: "sigmoid",
          units: 165,
        })
      );
      errorsModel.add(
        tf.layers.dense({
          name: "hidden-3",
          activation: "sigmoid",
          units: 65,
        })
      );
      errorsModel.add(
        tf.layers.dense({
          name: "hidden-4",
          activation: "sigmoid",
          units: 20,
        })
      );
      //Output layer
      errorsModel.add(
        tf.layers.dense({
          name: "output-layer",
          units: outputNeurons,
          activation: "softmax",
        })
      );
    }
    //Compile model
    errorsModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
    debugLog(`${errorsModel.summary()}`);
    //Create Xs and Ys for training
    //Get labels and data from files
    let trainLabelArray = JSON.parse(
      readFileSync("./AITrainingLabels.json").toString()
    );
    let trainDataJSON = JSON.parse(
      readFileSync("./AITrainingData.json").toString()
    );
    //Create data array from JSON
    let trainDataArray: Array<any> = [];
    trainDataJSON.forEach((movementSample: Array<any>) => {
      trainDataArray.push([]);
      movementSample.forEach((pose) => {
        trainDataArray[trainDataArray.length - 1].push([]);
        pose.forEach((keypoint: any) => {
          let keypointXYZ = [keypoint["x"], keypoint["y"], keypoint["z"]];
          trainDataArray[trainDataArray.length - 1][
            trainDataArray[trainDataArray.length - 1].length - 1
          ].push(keypointXYZ);
        });
      });
    });
    trainDataJSON = null; //Remove from memory
    //Create one hot encoding of training labels
    let trainingTensorLabels = tf.oneHot(
      tf.tensor1d(trainLabelArray, "int32"),
      outputNeurons
    );
    //Create training data tensor
    let trainTensors3D = [];
    for (let i = 0; i < trainDataArray.length; i++) {
      trainTensors3D.push(trainDataArray[i]);
    }
    let trainingTensorData = tf.tensor(trainTensors3D);
    //Get validation data from giles
    let validationLabelArray = JSON.parse(
      readFileSync("./AIValidationLabels.json").toString()
    );
    let validationDataJSON = JSON.parse(
      readFileSync("./AIValidationData.json").toString()
    );
    //Create data array from JSON
    let validationDataArray: Array<any> = [];
    validationDataJSON.forEach((movementSample: Array<any>) => {
      validationDataArray.push([]);
      movementSample.forEach((pose) => {
        validationDataArray[validationDataArray.length - 1].push([]);
        pose.forEach((keypoint: any) => {
          let keypointXYZ = [keypoint["x"], keypoint["y"], keypoint["z"]];
          validationDataArray[validationDataArray.length - 1][
            validationDataArray[validationDataArray.length - 1].length - 1
          ].push(keypointXYZ);
        });
      });
    });
    validationDataJSON = null; //Remove from memory
    //Create one hot encoding of validation labels
    let validationTensorLabels = tf.oneHot(
      tf.tensor1d(validationLabelArray, "int32"),
      outputNeurons
    );
    //Create validation data tensor
    let validationTensors3D = [];
    for (let i = 0; i < validationDataArray.length; i++) {
      validationTensors3D.push(validationDataArray[i]);
    }
    let validationTensorData = tf.tensor(validationTensors3D);
    //Training of model with data from JSONs
    const trainingResults = await errorsModel.fit(
      trainingTensorData,
      trainingTensorLabels,
      {
        batchSize: batchSize,
        epochs: trainingEpochs,
        validationData: [validationTensorData, validationTensorLabels],
        callbacks: { onEpochEnd },
      }
    );
    //Save outside of project
    const modelJSON = errorsModel.toJSON().toString();
    const modelWeights = errorsModel.getWeights();
    let weightsArray: Array<any> = [];
    modelWeights.forEach((weight) => {
      weightsArray.push(weight.arraySync());
    });
    //Destination folder must exist, files get created if needed
    writeFile("../errors_AI_model_data/model.json", modelJSON, (err) => {
      if (err) {
        errorLog(`Error writing topology file ${err}`);
      }
    });
    writeFile(
      "../errors_AI_model_data/weights.json",
      JSON.stringify(weightsArray),
      (err) => {
        if (err) {
          errorLog(`Error writing weights file ${err}`);
        } else {
        }
      }
    );
    return trainingResults;
  } catch (error) {
    errorLog(error);
    return { message: "error" };
  }
}
