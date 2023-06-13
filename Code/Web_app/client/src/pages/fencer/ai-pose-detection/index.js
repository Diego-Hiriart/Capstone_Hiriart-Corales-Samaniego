import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';

import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

tfjsWasm.setWasmPaths('.node_modules/@tensorflow/tfjs-backend-wasm/dist/');

import * as poseDetection from '@tensorflow-models/pose-detection';

import { Camera } from './camera.js';
import { RendererCanvas2d } from './renderer_canvas2d.js';
import { STATE } from './params.js';
import axios from "../../../services/axios";

let detector, camera;
let rafId;
let renderer = null;
let useGpuRenderer = false;
const detectionInterval = 3000; //1/12 of a second (12 fps)

const createDetector = async () => {
  const runtime = 'mediapipe';
  const model = poseDetection.SupportedModels.BlazePose;
  return poseDetection.createDetector(model, {
    runtime: runtime,
    modelType: 'full',
    solutionPath: '/node_modules/@mediapipe/pose',
  });
};

const poseAnalysis = async (poseData) => {
  if (poseData?.length) {
    try {
      const response = await axios.post("/dashboard/pose-detection", {
        data: poseData,
      })
      if (response.data.poseError) {
        showError();
      }
    } catch (error) {
      console.log(error);
      camera.video.pause();
      detector.dispose();
    }
  }
};

const renderResult = async () => {
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
  setInterval(async () => {
    await renderResult();
    rafId = requestAnimationFrame(renderPrediction); 
  }, detectionInterval);
};

export const poseDetectionAI = async () => {
  detector = await createDetector();
  const canvas = document.getElementById('output');
  canvas.width = camera.video.width;
  canvas.height = camera.video.height;
  renderer = new RendererCanvas2d(canvas);
  renderPrediction();
};

export const startCapture = async () => {
  camera = await Camera.setup(STATE.camera);
  camera.video.play();
}

export const stopCapture = async () => {
  camera.video.pause();
}

export const stopDetection = async () => {
  cancelAnimationFrame(rafId);
  if (detector != null) {
    detector.dispose();
  }
  if (camera != null) {
    camera.video.pause();
    camera.video.srcObject = null;
  }
}

export const showError = () => {
  
}