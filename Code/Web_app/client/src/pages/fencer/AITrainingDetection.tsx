import { useEffect, useState } from "react";
/*Followed tehese tutorials:
 * - Real Time Pose Estimation with Tensorflow.Js and Javascript https://www.youtube.com/watch?v=PyxsziqatFE)
 * - BlazePose MediaPipe https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe
 */
import {
  poseDetectionAI,
  startCapture,
  stopCapture,
} from "./ai-pose-detection/index";
import { isMobile } from "react-device-detect";
import "./styles/ai-training-detection.css";
import { css } from "@emotion/react";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button } from "@mui/material";

function AITrainingDetection() {
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const startCaptureAsync = async () => {
      await startCapture();
    };
    startCaptureAsync();
  }, []);

  const handleStart = async () => {
    await poseDetectionAI();
    setIsCapturing(true);
  };

  const handleStop = () => {
    stopCapture();
    setIsCapturing(false);
  };

  return (
    <div>
      {!isMobile && (
        <div>
          <Navbar />
          <h1>AECQ - entrenamiento individual</h1>
        </div>
      )}
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="canvas-wrapper">
          <video
            css={[outputCanvasStyles({ isMobile }), webPaneStyles]}
            autoPlay
            playsInline
            id="video"
          ></video>
          <canvas css={[outputCanvasStyles({isMobile}), renderPaneStyles]} id="output"></canvas>
        </div>
        <div id="scatter-gl-container"></div>
        {isCapturing ? (
          <Button sx={{width: "8rem", margin:"3rem"}} variant="outlined" onClick={handleStop}>Detener</Button>
        ) : (
          <Button sx={{width: "8rem", margin:"3rem"}} variant="contained" onClick={handleStart}>Iniciar</Button>
        )}
      </Box>
    </div>
  );
}

export default AITrainingDetection;

const outputCanvasStyles = ({ isMobile }: { isMobile: boolean }) => css`
  height: 480px;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: 0;
  text-align: center;
  width: 640px;
  z-index: 9;
  transform: scaleX(-1);
`;

const webPaneStyles = () => css`
  z-index: 8;
`

const renderPaneStyles = () => css`
  z-index: 9;
`
