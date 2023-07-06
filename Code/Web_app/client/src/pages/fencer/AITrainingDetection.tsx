import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createDetector } from "./ai-pose-detection/index";
import { isMobile } from "react-device-detect";
import { css } from "@emotion/react";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button, Stack, Typography } from "@mui/material";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";
import axios from "../../services/axios";
import { Camera } from "./ai-pose-detection/camera";
import { STATE } from "./ai-pose-detection/params";
import { PoseDetector } from "@tensorflow-models/pose-detection";
import useCountdown from "../../hooks/useCountdownTimer";
import AIErrorDialog from "./AIErrorDialog";
import { poseAnalisisResponseMock } from "./poseErrorMock";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { DetectedPose, Move, PoseAnalisisData } from "../../types";
import soundWarning from "/static/audio/beep-warning.mp3";

const beepWarning = new Audio(soundWarning);

function AITrainingDetection() {
  const countdown = 5; // seconds before starting detection
  const detectionInterval = 100; // milliseconds between each pose detection
  const requestInterval = 3000; // milliseconds between each request to backend (aka move duration)

  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [renderer, setRenderer] = useState<RendererCanvas2d>();
  const [detector, setDetector] = useState<PoseDetector>();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [poseAnalisisData, setPoseAnalisisData] =
    useState<PoseAnalisisData | null>(null);
  const [move, setMove] = useState<Move>([]);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalId = useRef<number>();
  const isAnalyzingRef = useRef(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const previousTime = useRef<number>(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!canvasRef.current || !webcamRef.current) return;
      canvasRef.current.width = webcamRef.current.width;
      canvasRef.current.height = webcamRef.current.height;
      setRenderer(new RendererCanvas2d(canvasRef.current));
      await Camera.setup(STATE.camera);
      startCapture();
      const blazePoseDetector = await createDetector();
      setDetector(blazePoseDetector);
      previousTime.current = durationTimer;
    };
    init().catch((error) => {
      console.error("Error initializing", error);
    });
  }, []);

  useEffect(() => {
    startDetection();
  }, [detector]);

  const startDetection = () => {
    if (!detector) {
      console.error("Detector does not exist");
      return;
    }
    intervalId.current = window.setInterval(() => {
      detect(detector);
    }, detectionInterval);
  };

  const detect = async (detector: PoseDetector) => {
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

    // Accumulate poses
    if (isAnalyzingRef.current) {
      setMove((poses: Move) => [...poses, pose]);
    }
  };

  // function to mimic async request using setTimeout
  const asyncRequest = (duration: number): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: "asdf" });
      }, duration);
    });
  };

  useEffect(() => {
    // If move array has accumulated (requestInterval / detectionInterval) elements, pause and send to backend
    // if (move?.length === requestInterval / detectionInterval) {

    // if (requestInterval / 1000) seconds have passed, pause and send to backend
    if (durationTimer === previousTime.current - requestInterval / 1000) {
      handlePause();
      const poseAnalysis = async () => {
        const url = "/dashboard/analyze_poses/";
        const body = {
          sessionId: state.sessionId,
          exercise: state.exercise,
          move,
          laterality: user?.fencer?.laterality,
        };
        const { data } = await axios.post(url, { data: body });
        // test
        // const { data } = await asyncRequest(1000);
        if (data.data) {
          setPoseAnalisisData(data.data);
          setErrorDialogOpen(true);
          beepWarning.play();
          setMove([]);
          return;
        }
        setMove([]);
        startSetupTimer();
      };
      // Send array of poses to backend
      poseAnalysis().catch((error) => {
        console.error("Error sending poses to backend", error);
        handleStop();
      });
    }
  }, [move]);

  const drawCanvas = (
    pose: DetectedPose,
    videoWidth: number,
    videoHeight: number
  ) => {
    if (!canvasRef.current) return;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const rendererParams = [webcamRef.current, pose, false];
    renderer?.draw(rendererParams);
  };

  const startAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    startDurationTimer();
    setIsAnalyzing(true);
    isAnalyzingRef.current = true;
  }, [isAnalyzing]);

  const handlePause = () => {
    setIsAnalyzing(false);
    isAnalyzingRef.current = false;
    stopDurationTimer();
    previousTime.current = durationTimer;
    resetSetupTimer();

    // Used for testing only
    // setIncorrectMoves((errorList: any) => [...errorList, poseAnalisisResponseMock.data.incorrectMove]);
  };

  const handleStop = useCallback(async () => {
    stopDetection();
    stopCapture();
    setMove([]);
    navigate(`/aitrainings`);
  }, []);

  const startCapture = async () => {
    if (webcamRef.current?.paused) {
      webcamRef.current?.play();
    }
  };

  const stopCapture = async () => {
    if (webcamRef.current?.srcObject) {
      (webcamRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }
  };

  const stopDetection = () => {
    if (!intervalId.current) return;
    clearInterval(intervalId.current);
    stopDurationTimer();
  };

  const handleClose = () => {
    setErrorDialogOpen(false);
  };

  // Timer for countdown before starting detection between moves
  const [
    setupTimer,
    startSetupTimer,
    stopSetupTimer,
    resetSetupTimer,
    isSetupTimerRunning,
  ] = useCountdown(countdown, startAnalysis);

  //Timer for session duration
  const [durationTimer, startDurationTimer, stopDurationTimer] = useCountdown(
    state.duration * 60,
    handleStop
  );

  // Stop webcam capture after unmounting
  useLayoutEffect(
    () => () => {
      stopCapture();
      stopDetection();
      stopSetupTimer();
    },
    []
  );

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
          <Typography>
            Puedes empezar cuando se muestren los puntos en la imagen de tu
            cuerpo
          </Typography>
          <div css={durationTimerStyles}>{durationTimer + "s"}</div>
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
          <div css={[buttonWrapperStyles]}>
            <Button
              css={buttonStyles({ isMobile })}
              variant="outlined"
              onClick={handleStop}
            >
              Detener
            </Button>
            <Button
              css={buttonStyles({ isMobile })}
              variant="contained"
              onClick={() => {
                setInitialized(true);
                startSetupTimer();
              }}
              disabled={initialized || detector === undefined}
            >
              Iniciar ({setupTimer})
            </Button>
          </div>
        </div>
      </Box>
      {poseAnalisisData && (
        <AIErrorDialog
          open={!!errorDialogOpen}
          handleClose={handleClose}
          poseAnalisisData={poseAnalisisData}
        />
      )}
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

const buttonWrapperStyles = css`
  position: absolute;
  left: 50%;
  bottom: -60px;
  transform: translateX(-50%);
  z-index: 10;
`;

const buttonStyles = ({ isMobile }: { isMobile: boolean }) => css`
  width: 8rem;
  height: 3rem;
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

const durationTimerStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 2rem;
  font-weight: bold;
  z-index: 10;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 1rem;
`;
