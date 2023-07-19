import { css } from "@emotion/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import { useCallback, useEffect, useRef, useState } from "react";

import { DetectedPose, PoseAnalisisData } from "../../types";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";

interface Props {
  open: boolean;
  handleClose: () => void;
  poseAnalisisData: PoseAnalisisData;
}

const AIErrorDialog = ({ open, handleClose, poseAnalisisData }: Props) => {
  const [errorRenderer, setErrorRenderer] = useState<RendererCanvas2d>();
  const [correctRenderer, setCorrectRenderer] = useState<RendererCanvas2d>();
  const errorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const correctCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawingInterval = 100; // milliseconds

  const errorCanvasWidth = 700;
  const errorCanvasHeight = 700;
  const correctCanvasWidth = 1920;
  const correctCanvasHeight = 1080;

  const setCanvasRef = useCallback((node: HTMLCanvasElement) => {
    if (!node) return;
    if (node.id === "error-canvas") {
      errorCanvasRef.current = node;
      errorCanvasRef.current.width = errorCanvasWidth;
      errorCanvasRef.current.height = errorCanvasHeight;
      setErrorRenderer(new RendererCanvas2d(errorCanvasRef.current));
      return;
    }
    correctCanvasRef.current = node;
    correctCanvasRef.current.width = correctCanvasWidth;
    correctCanvasRef.current.height = correctCanvasHeight;
    setCorrectRenderer(new RendererCanvas2d(correctCanvasRef.current));
  }, []);

  // Generator function to loop through poses
  // TODO: define return type
  function* stepGen(steps: DetectedPose[]): any {
    while (true) yield* steps;
  }

  useEffect(() => {
    if (!errorRenderer) {
      return;
    }
    if (!correctRenderer) {
      return;
    }

    const incorrectMoveGenerator = stepGen(poseAnalisisData.incorrectMove);
    const correctMoveGenerator = stepGen(poseAnalisisData.correctMove);

    const intervalId = window.setInterval(() => {
      drawCanvas(
        errorCanvasRef.current!,
        errorRenderer,
        incorrectMoveGenerator.next().value,
        errorCanvasWidth,
        errorCanvasHeight
      );
      drawCanvas(
        correctCanvasRef.current!,
        correctRenderer,
        correctMoveGenerator.next().value,
        correctCanvasWidth,
        correctCanvasHeight
      );
    }, drawingInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [errorRenderer, correctRenderer]);

  const drawCanvas = (
    canvas: HTMLCanvasElement,
    renderer: RendererCanvas2d,
    pose: Pose[],
    width: number,
    height: number
  ) => {
    canvas.width = width;
    canvas.height = height;
    const rendererParams = [canvas, pose, false, "playback"];
    renderer?.draw(rendererParams);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"} fullWidth>
      <DialogContent css={dialogContentStyles}>
        <Typography paragraph variant="h1" textAlign="center" color="#eb344f">
          Cometiste un error
        </Typography>
        {poseAnalisisData.lowConfidence && (
          <Typography color="orange">
            La confianza de la pose es baja, por lo que el resultado puede no
            ser preciso.
          </Typography>
        )}
        <div css={canvasContainerStyles}>
          <Box>
            <Typography paragraph variant="h5" textAlign="center" fontWeight="bold">
              Error Cometido
            </Typography>
            <canvas
              ref={setCanvasRef}
              css={[outputCanvasStyles, redBorder]}
              id="error-canvas"
            ></canvas>
          </Box>
          <Box>
            <Typography paragraph variant="h5" textAlign="center" fontWeight="bold">
              Movimiento Correcto
            </Typography>
            <canvas
              ref={setCanvasRef}
              css={[outputCanvasStyles, greenBorder]}
              id="correct-canvas"
            ></canvas>
          </Box>
        </div>
        <Box>
          <Typography component="span" fontWeight="bold">Movimiento Correcto: </Typography>
          <Typography component="span">{poseAnalisisData.title}</Typography>
          <br/>
          <Typography component="span" fontWeight="bold">Descripción: </Typography>
          <Typography component="span">{poseAnalisisData.description}</Typography>
        </Box>
        <DialogActions sx={{ paddingBottom: 0 }}>
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const dialogContentStyles = css`
  display: flex;
  flex-direction: column;
`;

const canvasContainerStyles = css`
  display: flex;
  justify-content: center;
  gap: 2rem;
  height: 100%;
  object-fit: contain;
  min-height: 0;
`;

const outputCanvasStyles = css`
  transform: scaleX(-1);
  object-fit: contain;
  width: 100%;
  max-width: 400px;
  min-width: 0;
  height: 400px;
`;

const redBorder = css`
  border: 1px solid red;
`;

const greenBorder = css`
  border: 1px solid green;
`;

export default AIErrorDialog;
