import { useEffect, useState } from "react";
/*Followed tehese tutorials:
 * - Real Time Pose Estimation with Tensorflow.Js and Javascript https://www.youtube.com/watch?v=PyxsziqatFE)
 * - BlazePose MediaPipe https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe
 */
import {
  poseDetectionAI,
  startCapture,
  stopCapture,
  stopDetection,
} from "./ai-pose-detection/index";
import { isMobile } from "react-device-detect";
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
    stopDetection();
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
      <Box>
        <div className="canvas-wrapper" css={canvasWrapperStyles({ isMobile })}>
          <video
            css={[outputCanvasStyles({ isMobile }), webPaneStyles]}
            autoPlay
            playsInline
            id="video"
          ></video>
          <canvas
            css={[outputCanvasStyles({ isMobile }), renderPaneStyles]}
            id="output"
          ></canvas>
          {isCapturing ? (
            <Button
              css={buttonStyles({ isMobile })}
              variant="outlined"
              onClick={handleStop}
            >
              Detener
            </Button>
          ) : (
            <Button
              css={buttonStyles({ isMobile })}
              variant="contained"
              onClick={handleStart}
            >
              Iniciar
            </Button>
          )}
        </div>
        <div id="scatter-gl-container"></div>
      </Box>
    </div>
  );
}

export default AITrainingDetection;

const outputCanvasStyles = ({ isMobile }: { isMobile: boolean }) => css`
  transform: scaleX(-1);
  object-fit: contain;
  height: 100%;
  max-height: 480px;
  width: 100%;
  max-width: 640px;
  position: absolute;
`;

const webPaneStyles = () => css`
  z-index: 8;
`;

const renderPaneStyles = () => css`
  z-index: 9;
`;

const buttonStyles = ({ isMobile }: { isMobile: boolean }) => css`
  width: 8rem;
  height: 3rem;
  z-index: 10;
  left: 50%;
  bottom: -60px;
  transform: translateX(-50%);
  position: absolute;
  ${isMobile &&
  `
    bottom: 20px;
  `}
`;

const canvasWrapperStyles = ({ isMobile }: { isMobile: boolean }) => css`
  position: relative;
  height: 100vh;
  max-height: 480px;
  max-width: 640px;
  margin: 0 auto;
`;
