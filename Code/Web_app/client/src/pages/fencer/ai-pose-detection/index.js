import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";

tfjsWasm.setWasmPaths(".node_modules/@tensorflow/tfjs-backend-wasm/dist/");

import * as poseDetection from "@tensorflow-models/pose-detection";

export const createDetector = () => {
  const runtime = "mediapipe";
  const model = poseDetection.SupportedModels.BlazePose;
  return poseDetection.createDetector(model, {
    runtime: runtime,
    modelType: "full",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404",
  });
};
