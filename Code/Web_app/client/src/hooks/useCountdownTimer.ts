import { useEffect, useRef, useState } from "react";

import sound1 from "/static/audio/beep1.mp3";
import sound2 from "/static/audio/beep2.mp3";

const beep1 = new Audio(sound1);
const beep2 = new Audio(sound2);

const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
  const [timer, setTimer] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<number>();

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimer(initialTime);
    setIsRunning(false);
  };

  const tick = () => {
    setTimer((prevTimer) => {
      if (prevTimer === 1) {
        beep2.play();
      } else if (prevTimer <= 4) {
        beep1.play();
      }
      return prevTimer - 1;
    });
  };

  useEffect(() => {
    if (timer <= 0) {
      stopTimer();
      onTimerEnd();
      return;
    }
    if (timer > 0 && isRunning) {
      timerId.current = window.setInterval(() => tick(), 1000);
    }
    return () => clearInterval(timerId.current);
  }, [timer, onTimerEnd, isRunning]);

  return [timer, startTimer, stopTimer, resetTimer, isRunning] as const;
};

export default useCountdownTimer;
