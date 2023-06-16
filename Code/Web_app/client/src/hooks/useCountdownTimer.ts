import { useEffect, useState } from "react";

const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
  const [timer, setTimer] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

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
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0){
      onTimerEnd();
    }
  }, [timer, onTimerEnd, isRunning]);

  return {timer, startTimer, stopTimer, resetTimer, isRunning};
};

export default useCountdownTimer;
