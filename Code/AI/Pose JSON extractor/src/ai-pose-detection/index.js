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
let posesPacketSize = 0,
  videoDuration,
  videoDone;
let extract2D;
let detectionsToMake;
let lastVideoTime;
//To save poses JSONs in packets
let posesJSON;
let currentPosesIndex;
let statusP;
let videoName;
let count;
//Delay between frames to see progress
const interFrameDelay = 100;

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
    let extrationKeypoints = extract2D ? 'keypoints' : 'keypoints3D';
    let keypointsData = poseData[0][extrationKeypoints];
    //Check if the current packet in the JSON is full, create a new one if so, otherwise add pose data
    if (posesJSON[currentPosesIndex].length == posesPacketSize) {
      posesJSON.push(
        extract2D ? [{ keypoints: keypointsData }] : [keypointsData]
      );
      currentPosesIndex++;
    } else {
      posesJSON[currentPosesIndex].push(
        extract2D ? { keypoints: keypointsData } : keypointsData
      );
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
  //Print progress
  console.log(`Detection number ${count}: `, poses);
  count++;
  //Add a delay so you can see progress and os that model can successfully extract poses from frames (yes, it matters)
  await new Promise((r) => setTimeout(r, interFrameDelay));
  //Save results in JSON to be downloaded
  savePoseData(poses);
};

const downloadPosesJSON = () => {
  if (posesJSON !== null && posesJSON !== undefined) {
    /*if (posesJSON[posesJSON.length - 1].length < posesPacketSize) {
      posesJSON.pop();
    }*/
    if (posesJSON.length == 0) {
      statusP.innerHTML =
        'Could not extract anything, try a diferent number of poses packet size or check your file';
    } else {
      statusP.innerHTML = 'Extraction complete, dowmloading';
    }
    alert('downloading poses JSON');
    const a = document.createElement('a');
    const file = new Blob(
      [JSON.stringify(extract2D ? posesJSON : posesJSON)],
      {
        type: 'text/plain',
      }
    );
    a.href = URL.createObjectURL(file);
    let fileName = videoName;
    fileName = `${fileName.substring(0, fileName.lastIndexOf('.'))}_${
      extract2D ? '2D' : '3D'
    }poses-JSON.json`;
    a.download = fileName;
    a.click();
    a.remove();
  }
};

const runPrediction = async () => {
  //Advance current time of video to analyze the right frames and get the specified poses per second;
  if (lastVideoTime <= videoDuration) {
    lastVideoTime += videoDuration / detectionsToMake;
    video.currentTime = lastVideoTime;
  } else {
    videoDone = true;
  }
  if (videoDone) {
    // video has finished.
    camera.clearCtx();
    camera.video.style.visibility = 'visible';
    downloadPosesJSON();
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
  //Initialize
  count = 1;
  videoDone = false;
  lastVideoTime = 0;
  posesJSON = [[]]; //To save poses JSONs in packets
  currentPosesIndex = 0;
  statusP;
  videoName;
  //Start process
  statusP = document.getElementById('extraction-status');
  statusP.innerHTML = 'Extraction in progress';
  videoName = extractionData.videoFile.name;
  //Update poses packet size
  posesPacketSize = Number(extractionData.posesPacketSize);
  //Parts to divide video in
  detectionsToMake = posesPacketSize;
  //Whether to extract 2D keypoints or not (default is 3d)
  extract2D = extractionData.extract2D;
  //Ensure video can be divided in the packet size +2 (to ensure initial empty detection doesnt cause failure obtaining packet size)
  if ((videoDuration / posesPacketSize) * posesPacketSize > videoDuration) {
    detectionsToMake += 2;
  }
  //Load and start video
  camera = new Context();
  detector = await createDetector();
  //Load video in page
  await updateVideo(extractionData.videoFile);
  //Start detecting
  await startDetection();
};
