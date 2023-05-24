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

export async function createAndTrainModel() {
  let errorsModel;
  const rnnBatchSize = 2;
  const trainingEpochs = 50;
  if (checkModelDataExists()) {
    errorsModel = await tf.loadLayersModel(
      'file://./errors_AI_model_data.json'
    );
  } else {
    errorsModel = tf.sequential();
    errorsModel.name = 'posesRNN';
    const inputLayerNeurons = 10;
    const inputKeypoints = 33;
    const keypointFeatures = 3;
    const inputLayerShape = [
      keypointFeatures,
      inputLayerNeurons,
      inputKeypoints,
    ];
    const rnnInputLayerTimesteps = Math.floor(
      inputLayerNeurons / keypointFeatures
    );
    const rnnInputShape = [keypointFeatures, rnnInputLayerTimesteps];
    const rnnOuputNeurons = 20;
    const nHiddenLayers = 1;
    const learningRate = 0.1;
    const outputNeurons = 48;
    //Input layer
    errorsModel.add(
      tf.layers.dense({
        units: inputLayerNeurons,
        inputShape: inputLayerShape,
        activation: 'relu',
      })
    );
    //Hidden layer
    errorsModel.add(tf.layers.reshape({ targetShape: rnnInputShape }));
    let lstm_cells = [];
    for (let index = 0; index < nHiddenLayers; index++) {
      lstm_cells.push(tf.layers.lstmCell({ units: rnnOuputNeurons }));
    }
    errorsModel.add(
      tf.layers.rnn({
        cell: lstm_cells,
        inputShape: rnnInputShape,
        returnSequences: false,
      })
    );
    //Output layer
    errorsModel.add(
      tf.layers.dense({
        units: outputNeurons,
        inputShape: [rnnOuputNeurons],
        activation: 'relu',
      })
    );
    //Compile model
    errorsModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'meanSquaredError',
    });
  }
  debugLog('Training goes here');
  //Training of model with data from JSONs
  /*
  const trainingHist = await errorsModel.fit(xs, ys, {
    batchSize: rnnBatchSize,
    epochs: trainingEpochs,
    callbacks: {
      onEpochEnd: async (epoch, log) => {
        debugLog(`Epoch ${epoch} (of ${trainingEpochs}): ${log}`);
      },
    },
  });
  return { stats: trainingHist };
  */
  return;
}
