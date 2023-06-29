import * as tf from '@tensorflow/tfjs';
import { existsSync, readFileSync, writeFile } from 'fs';

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

function onEpochEnd(epoch: any, logs: any) {
  debugLog(
    `Epoch ${epoch}\n \t-validation accuracy: ${logs.val_acc} | validation loss:${logs.val_loss} \n\t-accuracy: ${logs.acc} | loss:${logs.loss}`
  );
}

export async function createAndTrainModel(
  epochs: number,
  learningRate: number,
  batchSize: number,
  posesPerMovement: number
) {
  try {
    let errorsModel;
    const trainingEpochs = epochs;
    if (checkModelDataExists()) {
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
      const nHiddenLayers = 5;
      const outputNeurons = 50; //Detectable errors
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
        lstm_cells.push(tf.layers.lstmCell({ units: rnnTimeSteps }));
      }
      debugLog("Cells")
      debugLog(lstm_cells.length.toString())
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
          units: outputNeurons,
          activation: 'softmax',
        })
      );
    }
    //Compile model
    errorsModel.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    debugLog(`${errorsModel.summary()}`);
    //Create Xs and Ys for training
    //Get labels and data from files
    let labelArray = JSON.parse(
      readFileSync('./AITrainingLabels.json').toString()
    );
    let dataJSON = JSON.parse(readFileSync('./AITrainingData.json').toString());
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
    dataJSON = null; //Remove from memory
    //Create one hot encoding of labels
    let tensorLabels = tf.oneHot(tf.tensor1d(labelArray, 'int32'), 50);
    //Create data tensor
    let tensors3D = [];
    for (let i = 0; i < dataArray.length; i++) {
      tensors3D.push(dataArray[i]);
    }
    let tensorData = tf.tensor(tensors3D);
    //Training of model with data from JSONs
    const trainingResults = await errorsModel.fit(tensorData, tensorLabels, {
      batchSize: batchSize,
      epochs: trainingEpochs,
      validationSplit: 0.3,
      callbacks: { onEpochEnd },
    });
    //Save outside of project
    const modelJSON = errorsModel.toJSON().toString();
    const modelWeights = errorsModel.getWeights();
    let weightsArray: Array<any> = [];
    modelWeights.forEach((weight) => {
      weightsArray.push(weight.arraySync());
    });
    //Destination folder must exist, files get created if needed
    writeFile('../errors_AI_model_data/model.json', modelJSON, (err) => {
      if (err) {
        errorLog(`Error writing topology file ${err}`);
      }
    });
    writeFile(
      '../errors_AI_model_data/weights.json',
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
    return { message: 'error' };
  }
}
