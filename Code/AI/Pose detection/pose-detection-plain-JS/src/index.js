import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';

import * as mpPose from '@mediapipe/pose';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);

import * as poseDetection from '@tensorflow-models/pose-detection';

import { Camera } from './camera.js';
import { RendererCanvas2d } from './renderer_canvas2d.js';
import { STATE } from './params.js';

let detector, camera;
let rafId;
let renderer = null;
let useGpuRenderer = false;
const detectionInterval = 83;//1/12 of a second (12 fps)

const createDetector = async () => {
  const runtime = 'mediapipe';
  const model = poseDetection.SupportedModels.BlazePose;
  return poseDetection.createDetector(model, {
    runtime: runtime,
    modelType: 'full',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`,
  });
};

const poseAnalysis = (poseData) => {
  if (
    poseData !== undefined &&
    poseData[0] !== undefined &&
    poseData[0] !== null
  ) {
    console.log(
      'This will eventually be sent to a back-end API with a recurrent NN: ',
      poseData
    );
  }
};

const renderResult = async () => {
  console.log('render result');
  if (camera.video.readyState < 2) {
    await new Promise((resolve) => {
      camera.video.onloadeddata = () => {
        resolve(video);
      };
    });
  }

  let poses = null;
  let canvasInfo = null;

  // Detector can be null if initialization failed
  if (detector != null) {
    try {
      poses = await detector.estimatePoses(camera.video, {
        maxPoses: STATE.modelConfig.maxPoses,
        flipHorizontal: false,
      });
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }
  }
  poseAnalysis(poses);
  const rendererParams = useGpuRenderer
    ? [camera.video, poses, canvasInfo, STATE.modelConfig.scoreThreshold]
    : [camera.video, poses, STATE.isModelChanged];
  renderer.draw(rendererParams);
};

const renderPrediction = async () => {
  console.log('render prediction');
  setInterval(async () => {
    await renderResult();
    rafId = requestAnimationFrame(renderPrediction);
  }, detectionInterval);
};

const poseDetectionAI = async () => {
  camera = await Camera.setup(STATE.camera);
  detector = await createDetector();
  const canvas = document.getElementById('output');
  canvas.width = camera.video.width;
  canvas.height = camera.video.height;
  renderer = new RendererCanvas2d(canvas);
  renderPrediction();
};

poseDetectionAI();