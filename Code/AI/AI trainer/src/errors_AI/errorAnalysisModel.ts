import * as tf from '@tensorflow/tfjs';
import { existsSync } from 'fs';
import fs from 'fs';
require('dotenv').config();

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
    'D:/UDLA/Capstone Project/Repo/Code/AI/Pose analysis/src/errors_AI/errors_AI_model_data.json';
  if (existsSync(modelPath)) {
    return true;
  } else {
    errorLog('No previous AI models found for transfer learning');
    return false;
  }
}

function onEpochEnd(epoch: any, logs: any) {
  debugLog(`Epoch ${epoch} accuracy: ${logs.acc}`);
}

export async function createAndTrainModel(
  epochs: number,
  learningRate: number,
  batchSize: number,
  posesPerMovement: number
) {
  let errorsModel;
  const trainingEpochs = epochs;
  if (checkModelDataExists()) {
    errorsModel = await tf.loadLayersModel(
      'file://./errors_AI_model_data.json'
    );
  } else {
    errorsModel = tf.sequential();
    errorsModel.name = 'posesRNN';
    const inputKeypoints = 33;
    const keypointFeatures = 3;
    //If xs is a 3d tensor of shape [a, b, c,d], then inputShape of the first layer should be [b, c, d].
    //Shape of xs is [batch, 10 (poses per movement), 33 (keypoints), 3 (x, y, z of each keypoint)];
    const inputLayerShape = [
      posesPerMovement,
      inputKeypoints,
      keypointFeatures,
    ];
    const rnnTimeSteps = posesPerMovement;
    const rnnInputLayerFeatures = inputKeypoints * posesPerMovement;
    const rnnInputShape = [rnnInputLayerFeatures, rnnTimeSteps];
    const rnnOuputNeurons = 20;
    const nHiddenLayers = 1;
    const outputNeurons = 2; //Detectable errors
    //Input layer
    errorsModel.add(
      tf.layers.dense({
        name: 'input-layer',
        units: posesPerMovement,
        inputShape: inputLayerShape,
        activation: 'sigmoid',
      })
    );
    //Hidden layer, unidirectional RNN using LSTM
    errorsModel.add(
      tf.layers.reshape({ name: 'rnnReshape', targetShape: rnnInputShape })
    );
    let lstm_cells = [];
    for (let index = 0; index < nHiddenLayers; index++) {
      lstm_cells.push(tf.layers.lstmCell({ units: rnnOuputNeurons }));
    }
    console.log(errorsModel.summary());
    errorsModel.add(
      tf.layers.rnn({
        name: 'hidden-rnn',
        cell: lstm_cells, //LSTM uses tahn activation
        inputShape: rnnInputShape,
        returnSequences: false,
      })
    );
    //Output layer
    errorsModel.add(
      tf.layers.dense({
        name: 'output-layer',
        units: 2,
        activation: 'softmax',
      })
    );
    //Compile model
    errorsModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }
  console.log(errorsModel.summary());
  //Create Xs and Ys for training
  //Get labels and data from files
  let labelArray = JSON.parse(
    fs
      .readFileSync(
        `${process.env.BASE_URL}src/errors_AI/AITrainingLabels.json`
      )
      .toString()
  );
  let dataJSON = JSON.parse(
    fs
      .readFileSync(`${process.env.BASE_URL}src/errors_AI/AITrainingData.json`)
      .toString()
  );
  //Create data array from JSON
  let dataArray: Array<any> = [];
  dataJSON.forEach((movementSample: Array<any>) => {
    dataArray.push([]);
    movementSample.forEach((pose) => {
      dataArray[dataArray.length - 1].push([]);
      pose.forEach((keypoint: any) => {
        let keypointXYZ = [keypoint['x'], keypoint['y'], keypoint['z']];
        dataArray[dataArray.length - 1][
          dataArray[dataArray.length - 1].length - 1
        ].push(keypointXYZ);
      });
    });
  });
  dataJSON = null; //Remove form memory
  //Create one hot encoding of labels
  let tensorLabels = tf.oneHot(tf.tensor1d(labelArray, 'int32'), 2);
  //Create data tensor
  let tensors3D = [];
  for (let i = 0; i < dataArray.length; i++) {
    tensors3D.push(dataArray[i]);
  }
  let tensorData = tf.tensor(tensors3D);
  //Training of model with data from JSONs
  console.log('train');
  const trainingResults = await errorsModel.fit(tensorData, tensorLabels, {
    batchSize: batchSize,
    epochs: trainingEpochs,
    callbacks: { onEpochEnd },
  });
  console.log('after train');
  //Testing
  let testData = JSON.parse(
    fs
      .readFileSync(
        `${process.env.BASE_URL}src/errors_AI/Elbow extension L validate_poses-JSON.json`
      )
      .toString()
  );
  let testX: Array<any> = [];
  testData.forEach((movementSample: Array<any>) => {
    movementSample.forEach((pose) => {
      testX.push([]);
      pose.forEach((keypoint: any) => {
        let keypointXYZ = [keypoint['x'], keypoint['y'], keypoint['z']];
        testX[testX.length - 1].push(keypointXYZ);
      });
    });
  });
  let tensorX = tf.tensor([testX]);
  let results = errorsModel.predict(tensorX);
  console.log(results.toString());
  return trainingResults;
}
