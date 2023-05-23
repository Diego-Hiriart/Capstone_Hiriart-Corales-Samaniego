//Based on: https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/demos/upload_video/src/index.js
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';

import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

tfjsWasm.setWasmPaths('.node_modules/@tensorflow/tfjs-backend-wasm/dist/');

import * as poseDetection from '@tensorflow-models/pose-detection';

import { Context } from './camera.js';
import { STATE } from './params.js';

let detector, camera;
let rafId;
let posesPacketSize,
  videoDuration,
  videoDone = false;
let lastVideoTime = 0;
//To save poses JSONs in packets
let posesJSON = [];
let currentPosesIndex = 0;

const createDetector = async () => {
  const runtime = 'mediapipe';
  const model = poseDetection.SupportedModels.BlazePose;
  return poseDetection.createDetector(model, {
    runtime: runtime,
    modelType: 'heavy',
    solutionPath: './node_modules/@mediapipe/pose',
  });
};

const savePoseData = (poseData) => {
  if (
    (poseData !== undefined) | null &&
    poseData[0] !== undefined &&
    poseData[0] !== null
  ) {
    let keypoints3DData = poseData[0]['keypoints3D'];
    console.log(
      'Added pose data to JSON (which will be downloaded when done)',
      keypoints3DData
    );
    //Check if the current packet in the JSON is full, create a new one if so, otherwise add pose data
    if (posesJSON[currentPosesIndex].length == posesPacketSize) {
      posesJSON.push(keypoints3DData);
      currentPosesIndex++;
    } else {
      posesJSON[currentPosesIndex].push(keypoints3DData);
    }
  }
};

const renderResult = async () => {
  const poses = await detector.estimatePoses(camera.video, {
    maxPoses: STATE.modelConfig.maxPoses,
    flipHorizontal: false,
  });
  camera.drawCtx();

  // The null check makes sure the UI is not in the middle of changing to a
  // different model. If during model change, the result is from an old
  // model, which shouldn't be rendered.
  if (poses != undefined && poses.length > 0 && !STATE.isModelChanged) {
    camera.drawResults(poses);
  }
  //Save results in JSON to be downloaded
  savePoseData(poses);
};

const runPrediction = async () => {
  //Advance current time of video to analyze the right frames and get the specified poses per second
  if (lastVideoTime <= videoDuration) {
    lastVideoTime += 1 / posesPacketSize;
    video.currentTime = lastVideoTime;
  } else {
    videoDone = true;
  }
  if (videoDone) {
    // video has finished.
    camera.clearCtx();
    camera.video.style.visibility = 'visible';
    return;
  }
  await renderResult();
  rafId = requestAnimationFrame(runPrediction);
};

const updateVideo = async (videoFile) => {
  // Clear reference to any previous uploaded video.
  URL.revokeObjectURL(camera.video.currentSrc);
  const file = videoFile;
  camera.source.src = URL.createObjectURL(file);

  // Wait for video to be loaded.
  camera.video.load();
  await new Promise((resolve) => {
    camera.video.onloadeddata = () => {
      resolve(video);
    };
  });

  const videoWidth = camera.video.videoWidth;
  const videoHeight = camera.video.videoHeight;
  // Must set below two lines, otherwise video element doesn't show.
  camera.video.width = videoWidth;
  camera.video.height = videoHeight;
  camera.canvas.width = videoWidth;
  camera.canvas.height = videoHeight;

  videoDuration = video.duration;
};

const startDetection = async () => {
  // Warming up pipeline.
  const [runtime, $backend] = STATE.backend.split('-');

  if (runtime === 'tfjs') {
    const warmUpTensor = tf.fill(
      [camera.video.height, camera.video.width, 3],
      0,
      'float32'
    );
    await detector.estimatePoses(warmUpTensor, {
      maxPoses: STATE.modelConfig.maxPoses,
      flipHorizontal: false,
    });
    warmUpTensor.dispose();
  }

  camera.video.style.visibility = 'hidden';
  video.pause();
  //Run detection
  await runPrediction();
};

export const poseDetectionAI = async (extractionData) => {
  //Update poses packet size
  posesPacketSize = extractionData.posesPacketSize;
  //Load and start video
  camera = new Context();
  detector = await createDetector();
  //Initialice JSON
  posesJSON.push([]);
  //Load video in page
  await updateVideo(extractionData.videoFile);
  await startDetection();
  return posesJSON;
};
