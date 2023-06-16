import { useEffect, useRef, useState } from "react";
import { createDetector } from "./ai-pose-detection/index";
import { isMobile } from "react-device-detect";
import { css } from "@emotion/react";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button } from "@mui/material";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";
import axios from "../../services/axios";
import { Camera } from "./ai-pose-detection/camera";
import { STATE } from "./ai-pose-detection/params";
import { PoseDetector } from "@tensorflow-models/pose-detection";
import useCountdownTimer from "../../hooks/useCountdownTimer";

function AITrainingDetection() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [renderer, setRenderer] = useState<RendererCanvas2d>();
  const [detector, setDetector] = useState<PoseDetector>();
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalId = useRef<number>();

  const countdown = 5;
  const detectionInterval = 100;

  useEffect(() => {
    const init = async () => {
      if (!canvasRef.current || !webcamRef.current) return;
      canvasRef.current.width = webcamRef.current.width;
      canvasRef.current.height = webcamRef.current.height;
      setRenderer(new RendererCanvas2d(canvasRef.current));
      await Camera.setup(STATE.camera);
      const blazePoseDetector = await createDetector();
      setDetector(blazePoseDetector);
      startCapture();
    };
    init();
  }, []);

  const startDetection = () => {
    if (!detector) {
      console.error("Detector does not exist");
      return;
    }
    intervalId.current = window.setInterval(() => {
      detect(detector);
    }, detectionInterval);
  };

  const detect = async (detector: any) => {
    if (!webcamRef.current) return;

    // Get Video Properties
    const videoWidth = webcamRef.current.videoWidth;
    const videoHeight = webcamRef.current.videoHeight;

    // Set video width and height
    webcamRef.current.width = videoWidth;
    webcamRef.current.height = videoHeight;

    // Detect Pose
    const pose = await detector.estimatePoses(webcamRef.current, {
      maxPoses: 1,
    });

    // Draw Pose
    drawCanvas(pose, videoWidth, videoHeight);

    // Send Pose to Backend
    // poseAnalysis(pose)
  };

  const drawCanvas = (pose: any, videoWidth: any, videoHeight: any) => {
    if (!canvasRef.current) return;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const rendererParams = [webcamRef.current, pose, false];
    renderer?.draw(rendererParams);
  };

  // Sends pose to backend
  const poseAnalysis = async (pose: any) => {
    try {
      const url = "/dashboard/pose-analysis";
      const data = pose;
      const response = await axios.post(url, data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleStart = async () => {
    if (isDetecting) return;
    startDetection();
    setIsDetecting(true);
  };

  const handleStop = () => {
    if (!isDetecting) return;
    resetTimer();
    stopDetection();
    setIsDetecting(false);
  };

  const startCapture = async () => {
    if (webcamRef.current?.paused) {
      webcamRef.current?.play();
    }
  };

  const stopDetection = () => {
    clearInterval(intervalId.current);
  };

  const { timer, startTimer, resetTimer, isRunning } = useCountdownTimer(countdown, handleStart);

  return (
    <div>
      {!isMobile && (
        <div>
          <Navbar />
          <h1>AECQ - entrenamiento individual </h1>
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
          {isDetecting ? (
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
              onClick={startTimer}
              disabled={isRunning}
            >
              Iniciar ({timer})
            </Button>
          )}
        </div>
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
