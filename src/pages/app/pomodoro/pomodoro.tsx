import { HiArrowPath, HiPause, HiPlay } from "react-icons/hi2";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PomodoroTimerRemind } from "@/components/pomodoro-timer-remind";
import { Button } from "@/components/ui/button";
import { usePomodoro } from "@/hooks/use-pomodoro";

const data = [
  {
    date: "24/06",
    foco: 120, // minutos
    descanso: 40,
  },
  {
    date: "25/06",
    foco: 90,
    descanso: 30,
  },
  {
    date: "24/06",
    foco: 120, // minutos
    descanso: 40,
  },
  {
    date: "25/06",
    foco: 90,
    descanso: 30,
  },
  {
    date: "24/06",
    foco: 120, // minutos
    descanso: 40,
  },
  {
    date: "25/06",
    foco: 90,
    descanso: 30,
  },
  {
    date: "24/06",
    foco: 120, // minutos
    descanso: 40,
  },
  // ...
];

const PomodoroPage = () => {
  const { start, pause, reset, isRunning, switchMode } = usePomodoro();

  return (
    <div className="flex flex-col gap-20">
      <div className="flex w-full flex-col items-center justify-start gap-6 rounded-xl p-4">
        <div className="space-x-4">
          <Button
            onClick={() => switchMode("pomodoro")}
            size="lg"
            variant="secondary"
          >
            Pomodoro
          </Button>
          <Button
            onClick={() => switchMode("longBreak")}
            size="lg"
            variant="secondary"
          >
            Long Break
          </Button>
          <Button
            onClick={() => switchMode("shortBreak")}
            size="lg"
            variant="secondary"
          >
            Short Break
          </Button>
        </div>
        <div className="w-72">
          <PomodoroTimerRemind className="text-9xl" />
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button
            onClick={() => {
              if (isRunning) {
                return pause();
              }
              start();
            }}
            size="lg"
            variant="secondary"
          >
            {isRunning ? <HiPause /> : <HiPlay />}
            {isRunning ? "Pause" : "Start"}
          </Button>

          <Button onClick={reset} size="lg" variant="secondary">
            <HiArrowPath />
            Reset
          </Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            label={{ value: "Minutos", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="foco" stackId="a" fill="#8884d8" name="Tempo Focado" />
          <Bar
            dataKey="descanso"
            stackId="a"
            fill="#82ca9d"
            name="Tempo de Descanso"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { PomodoroPage };
