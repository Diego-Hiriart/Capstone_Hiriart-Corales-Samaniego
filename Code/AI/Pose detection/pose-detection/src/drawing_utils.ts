/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/*Original file form which drawKeypoints, drawKepoints3D, and drawSkeleton were obtained:
 * https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/demos/live_video/src/renderer_canvas2d.js
 */
import * as posedetection from '@tensorflow-models/pose-detection';

import * as params from './params';

// These anchor points allow the pose pointcloud to resize according to its
// position in the input.
const ANCHOR_POINTS = [
  [0, 0, 0],
  [0, 1, 0],
  [-1, 0, 0],
  [-1, -1, 0],
];

// #ffffff - White
// #800000 - Maroon
// #469990 - Malachite
// #e6194b - Crimson
// #42d4f4 - Picton Blue
// #fabed4 - Cupid
// #aaffc3 - Mint Green
// #9a6324 - Kumera
// #000075 - Navy Blue
// #f58231 - Jaffa
// #4363d8 - Royal Blue
// #ffd8b1 - Caramel
// #dcbeff - Mauve
// #808000 - Olive
// #ffe119 - Candlelight
// #911eb4 - Seance
// #bfef45 - Inchworm
// #f032e6 - Razzle Dazzle Rose
// #3cb44b - Chateau Green
// #a9a9a9 - Silver Chalice
const COLOR_PALETTE = [
  '#ffffff',
  '#800000',
  '#469990',
  '#e6194b',
  '#42d4f4',
  '#fabed4',
  '#aaffc3',
  '#9a6324',
  '#000075',
  '#f58231',
  '#4363d8',
  '#ffd8b1',
  '#dcbeff',
  '#808000',
  '#ffe119',
  '#911eb4',
  '#bfef45',
  '#f032e6',
  '#3cb44b',
  '#a9a9a9',
];
const drawKeypoint = (
  keypoint: posedetection.Keypoint,
  scoreThreshold: number,
  ctx: any
) => {
  // If score is null, just show the keypoint.
  const score = keypoint.score != null ? keypoint.score : 1;

  if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, params.DEFAULT_RADIUS, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
  }
};

/**
 * Draw the keypoints on the video.
 * @param keypoints A list of keypoints.
 */
export const drawKeypoints = (
  keypoints: posedetection.Keypoint[],
  scoreThreshold: number,
  ctx: any,
  poseModel: posedetection.SupportedModels
) => {
  const keypointInd = posedetection.util.getKeypointIndexBySide(poseModel);
  ctx.fillStyle = 'Red';
  ctx.strokeStyle = 'White';
  ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

  for (const i of keypointInd.middle) {
    drawKeypoint(keypoints[i], scoreThreshold, ctx);
  }

  ctx.fillStyle = 'Green';
  for (const i of keypointInd.left) {
    drawKeypoint(keypoints[i], scoreThreshold, ctx);
  }

  ctx.fillStyle = 'Orange';
  for (const i of keypointInd.right) {
    drawKeypoint(keypoints[i], scoreThreshold, ctx);
  }
};

/**
 * Draw the skeleton of a body on the video.
 * @param keypoints A list of keypoints.
 */
export const drawSkeleton = (
  keypoints: posedetection.Keypoint[],
  poseId: number | null,
  scoreThreshold: number,
  ctx: any,
  poseModel: posedetection.SupportedModels
) => {
  // Each poseId is mapped to a color in the color palette.
  const color = poseId != null ? COLOR_PALETTE[poseId % 20] : 'White';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

  posedetection.util.getAdjacentPairs(poseModel).forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];

    // If score is null, just show the keypoint.
    const score1 = kp1.score != null ? kp1.score : 1;
    const score2 = kp2.score != null ? kp2.score : 1;

    if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    }
  });
};
