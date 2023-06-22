import { useEffect, useState } from "react";

const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
  const [timer, setTimer] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [beep1] = useState(new Audio("/static/audio/beep1.mp3"));
  const [beep2] = useState(new Audio("/static/audio/beep2.mp3"));

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

  useEffect(() => {
    if (timer > 0 && isRunning) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            beep2.play();
          } else if (prevTimer <= 4) {
            beep1.play();
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      onTimerEnd();
    }
  }, [timer, onTimerEnd, isRunning]);

  return { timer, startTimer, stopTimer, resetTimer, isRunning };
};

export default useCountdownTimer;
