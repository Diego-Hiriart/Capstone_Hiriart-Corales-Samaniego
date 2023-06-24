import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  Stack,
  Box,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { RendererCanvas2d } from "./ai-pose-detection/renderer_canvas2d";
import { css } from "@emotion/react";
import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import { DetectedPose, PoseAnalisisData } from "../../types";

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
  const canvasSize = 700; // TODO: take value from error

  const setCanvasRef = useCallback((node: HTMLCanvasElement) => {
    if (!node) return;
    if (node.id === "error-canvas") {
      errorCanvasRef.current = node;
      errorCanvasRef.current.width = canvasSize;
      errorCanvasRef.current.height = canvasSize;
      setErrorRenderer(new RendererCanvas2d(errorCanvasRef.current));
      return;
    }
    correctCanvasRef.current = node;
    correctCanvasRef.current.width = canvasSize;
    correctCanvasRef.current.height = canvasSize;
    setCorrectRenderer(new RendererCanvas2d(correctCanvasRef.current));
  }, []);

  // Generator function to loop through poses
  function* stepGen(steps: DetectedPose[]): any { // TODO: define return type
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
        incorrectMoveGenerator.next().value
      );
      drawCanvas(
        correctCanvasRef.current!,
        correctRenderer,
        correctMoveGenerator.next().value
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
  ) => {
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const rendererParams = [canvas, pose, false, "playback"];
    renderer?.draw(rendererParams);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <DialogTitle>{poseAnalisisData.title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" gap={4} flexWrap="wrap" justifyContent="center">
          <Box>
            <canvas
              ref={setCanvasRef}
              css={[outputCanvasStyles(canvasSize), redBorder]}
              id="error-canvas"
            ></canvas>
          </Box>
          <Box>
            <canvas
              ref={setCanvasRef}
              css={[outputCanvasStyles(canvasSize), greenBorder]}
              id="correct-canvas"
            ></canvas>
          </Box>
        </Stack>
        <Typography>{poseAnalisisData.description}</Typography>
        <DialogActions sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleClose}>
            Continuar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const outputCanvasStyles = (canvasSize: number) => css`
  transform: scaleX(-1);
  object-fit: contain;
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 400px;
`;

const redBorder = css`
  border: 1px solid red;
`

const greenBorder = css`
  border: 1px solid green;
`

export default AIErrorDialog;
