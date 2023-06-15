import { useEffect, useRef, useState } from "react";
import {
  createDetector,
} from "./ai-pose-detection/index";
import { isMobile } from "react-device-detect";
import { css } from "@emotion/react";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button } from "@mui/material";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";
import axios from "../../services/axios";
import { Camera } from "./ai-pose-detection/camera";
import { STATE } from "./ai-pose-detection/params";

function AITrainingDetection() {
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const detectionInterval = 1000;
  let renderer: RendererCanvas2d;
  let intervalId: number;

  const init = () => {
    if (!canvasRef.current || !webcamRef.current) return;
    canvasRef.current.width = webcamRef.current.width;
    canvasRef.current.height = webcamRef.current.height;
    renderer = new RendererCanvas2d(canvasRef.current);
    startCapture();
  };

  const startDetection = async () => {
    try {
      const detector = await createDetector();
      intervalId = window.setInterval(() => {
        detect(detector);
      }, detectionInterval);
    } catch (error) {
      console.error("There was an error starting the detection: ", error);
    }
  };

  const detect = async (detector: any) => {
    if (!webcamRef.current) return;

    // Get Video Properties
    const videoWidth = webcamRef.current.videoWidth;
    const videoHeight = webcamRef.current.videoHeight;

    // Set video width
    webcamRef.current.width = videoWidth;
    webcamRef.current.height = videoHeight;

    // Detect Pose
    const pose = await detector.estimatePoses(webcamRef.current, {
      maxPoses: 1,
    });

    // Send Pose to Backend
    // poseAnalysis(pose)

    drawCanvas(pose, videoWidth, videoHeight);
  };

  const drawCanvas = (pose: any, videoWidth: any, videoHeight: any) => {
    if (!canvasRef.current) return;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const rendererParams = [webcamRef.current, pose, false];
    renderer.draw(rendererParams);
  };

  const poseAnalysis = async (pose: any) => {
    try {
      const url = "/dashboard/pose-analysis";
      const data = pose;
      return await axios.post(url, data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStart = () => {
    startDetection();
    setIsCapturing(true);
  };

  const handleStop = () => {
    stopCapture();
    stopDetection();
    setIsCapturing(false);
  };

  const startCapture = async () => {
    await Camera.setup(STATE.camera);
    webcamRef.current?.play();
  }

  const stopCapture = async () => {
    webcamRef.current?.pause();
  }

  const stopDetection = () => {
    clearInterval(intervalId);
  }

  init();

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
            ref={webcamRef}
            css={[outputCanvasStyles({ isMobile }), webPaneStyles]}
            autoPlay
            playsInline
            id="video"
          ></video>
          <canvas
            ref={canvasRef}
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
