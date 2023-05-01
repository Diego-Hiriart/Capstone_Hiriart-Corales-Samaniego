import React, { useEffect } from 'react';
import './App.css';
/*Followed tehese tutorials:
 * - Real Time Pose Estimation with Tensorflow.Js and Javascript https://www.youtube.com/watch?v=PyxsziqatFE)
 * - BlazePose MediaPipe https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe
 */
import { poseDetectionAI } from './ai-pose-detection/index';

function App() {
  //Continously run detection
  useEffect(() => {
    const runPoseDetection = async () => {
      await poseDetectionAI();
    };
    runPoseDetection();
  }, []);

  return (
    <div className='App'>
      <h1>AECQ - entrenamiento individual</h1>
      <p>Usando BlazePose "full"</p>
      <div className='container'>
        <div className='canvas-wrapper'>
          <video
            autoPlay
            playsInline
            className='output-canvas webcam-pane'
            id='video'
          ></video>
          <canvas className='output-canvas render-pane' id='output'></canvas>
        </div>
        <div id="scatter-gl-container"></div>
      </div>
    </div>
  );
}

export default App;
