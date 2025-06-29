import * as React from "react";

type PomodoroMode = "pomodoro" | "shortBreak" | "longBreak";

interface PomodoroContextType {
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  hasActivePomodoro: boolean;
  minutes: number;
  seconds: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchMode: (mode: PomodoroMode) => void;
}

const PomodoroContext = React.createContext<PomodoroContextType | undefined>(
  undefined,
);

const DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<PomodoroMode>("pomodoro");
  const [timeLeft, setTimeLeft] = React.useState(DURATIONS["pomodoro"]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [hasActivePomodoro, setHasActivePomodoro] = React.useState(false);
  const intervalRef = React.useRef<number | null>(null);

  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const start = () => {
    if (isRunning || intervalRef.current !== null) return;

    setIsRunning(true);
    setHasActivePomodoro(true);

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          setHasActivePomodoro(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    pause();
    setHasActivePomodoro(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const switchMode = (newMode: PomodoroMode) => {
    pause();
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        hasActivePomodoro,
        minutes,
        seconds,
        start,
        pause,
        reset,
        switchMode,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

const usePomodoro = () => {
  const context = React.useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};

export { PomodoroProvider, usePomodoro };
