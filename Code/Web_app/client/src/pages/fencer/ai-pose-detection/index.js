import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
);

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
