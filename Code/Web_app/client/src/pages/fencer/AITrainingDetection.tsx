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
import { Box, Button, Typography } from "@mui/material";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";
import axios from "../../services/axios";
import { Camera } from "./ai-pose-detection/camera";
import { STATE } from "./ai-pose-detection/params";
import { PoseDetector } from "@tensorflow-models/pose-detection";
import useCountdown from "../../hooks/useCountdownTimer";
import AIErrorDialog from "./AIErrorDialog";
import { poseAnalisisResponseMock } from "./poseErrorMock";
import { useAlert } from "../../hooks/useAlert";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { DetectedPose, Move, PoseAnalisisData } from "../../types";

function AITrainingDetection() {
  const countdown = 3; // seconds before starting detection
  const detectionInterval = 100; // milliseconds

  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showError } = useAlert();
  const [isDetecting, setIsDetecting] = useState(false);
  const [renderer, setRenderer] = useState<RendererCanvas2d>();
  const [detector, setDetector] = useState<PoseDetector>();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [poseAnalisisData, setPoseAnalisisData] =
    useState<PoseAnalisisData | null>(null); // TODO: define errorPose type from response
  const [move, setMove] = useState<Move>([]);
  const [beepWarning] = useState(new Audio("/static/audio/beep-warning.mp3"));
  const [incorrectMoves, setIncorrectMoves] = useState<Move[]>([]);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalId = useRef<number>();

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
    init().catch((error) => {
      console.error("Error initializing", error);
    });
  }, []);

  useLayoutEffect(
    () => () => {
      stopCapture();
    },
    []
  );

  const startDetection = () => {
    if (!detector) {
      console.error("Detector does not exist");
      return;
    }
    startDurationTimer();
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

    // Accumulate n poses
    setMove((poses: Move) => [...poses, pose]);
  };

  useEffect(() => {
    if (move?.length === 1000 / detectionInterval) {
      const poseAnalysis = async () => {
        const url = "/dashboard/analyze-pose";
        const { data } = await axios.post(url, move);
        if (data.data) {
          handlePause();
          setIncorrectMoves((incorrectMoves: Move[]) => [
            ...incorrectMoves,
            move,
          ]);
          setPoseAnalisisData(data.data);
          setErrorDialogOpen(true);
        }
      };
      // Send array of poses to backend
      // poseAnalysis().catch((error) => {
      //   console.error("Error sending poses to backend", error);
      //   handleStop();
      // });
      // console.log(move);
      setMove([]);
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

  const handleStart = useCallback(async () => {
    if (isDetecting) return;
    startDetection();
    setIsDetecting(true);
  }, [isDetecting, detector]);

  const handlePause = () => {
    if (!isDetecting) return;
    resetTimer();
    stopDetection();
    // Used for testing only
    // setIncorrectMoves((errorList: any) => [...errorList, poseAnalisisResponseMock.data.incorrectMove]);
    setIsDetecting(false);
    setMove([]);
    beepWarning.play();
  };

  const handleStop = useCallback(async () => {
    stopDetection();
    stopCapture();
    setIsDetecting(false);
    setMove([]);
    const url = "/dashboard/aitraining";
    const aiTrainingObj = {
      exercise: state.exercise,
      poseErrorList: incorrectMoves,
      duration: state.duration - durationTimer / 60,
    };
    try {
      // const { data } = await axios.post(url, aiTrainingObj);
      console.log(aiTrainingObj);
      navigate(`/aitrainings`);
    } catch (error) {
      console.error("Error saving training", error);
      showError("Error al guardar el entrenamiento");
    }
  }, [incorrectMoves]);

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
    clearInterval(intervalId.current);
    stopDurationTimer();
  };

  const handleClose = () => {
    setErrorDialogOpen(false);
  };

  const [timer, startTimer, stopTimer, resetTimer, isRunning] = useCountdown(
    countdown,
    handleStart
  );

  const [
    durationTimer,
    startDurationTimer,
    stopDurationTimer,
    resetDurationTimer,
    isDurationRunning,
  ] = useCountdown(state.duration * 60, handleStop);

  // Remove eventually (might need later for testing responsive layout):

  // function handleOnError() {
  //   handlePause();
  //   beepWarning.play();
  //   setPoseAnalisisData(poseAnalisisResponseMock.data);
  //   setErrorDialogOpen(true);
  // }

  // useEffect(() => {
  //   console.log(poseAnalisisData);
  // }, [poseAnalisisData]);

  return (
    <div>
      {!isMobile && (
        <div>
          <Navbar />
          <h1>AECQ - entrenamiento individual </h1>
          {/* <Button onClick={handleOnError}>error</Button> */}
        </div>
      )}
      <Box>
        <div className="canvas-wrapper" css={canvasWrapperStyles({ isMobile })}>
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
`